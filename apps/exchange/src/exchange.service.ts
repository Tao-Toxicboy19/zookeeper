import {
    BalanceDto,
    BalanceResponse,
    ExchangeResponse,
    KEY_PACKAGE_NAME,
    KEY_SERVICE_NAME,
    KeyServiceClient,
    ValidateKeyDto,
} from '@app/common'
import {
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc, ClientProxy } from '@nestjs/microservices'
import * as ccxt from 'ccxt'
import { Key } from './type'
import { createLimitOrderDto } from './dto/create-limit-order.dto'
import { Orders } from './types/order.type'
import { State } from './types/state.type'
import {
    GrpcAlreadyExistsException,
    GrpcUnavailableException,
} from 'nestjs-grpc-exceptions'

@Injectable()
export class ExchangeService implements OnModuleInit {
    private exchange: ccxt.Exchange
    private keyServiceClient: KeyServiceClient
    private readonly long: string = 'LONG'
    private readonly short: string = 'SHORT'

    private readonly logger: Logger = new Logger(ExchangeService.name)

    constructor(
        @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
        @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    ) {}

    async onModuleInit() {
        this.keyServiceClient =
            this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    }

    async query(userId: string): Promise<Orders[]> {
        return new Promise<Orders[]>((resolve, reject) => {
            this.client
                .send<Orders[]>('query_order', { user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
        })
    }

    async position({ userId }: { userId: string }): Promise<State> {
        try {
            const [orders, apiKeys] = await Promise.all([
                this.query(userId),
                this.getApiKeys(userId),
            ])

            if (!orders || !orders.length) {
                return {
                    status: 'success',
                    message: 'Not found orders.',
                }
            }

            const { apiKey, secretKey } = apiKeys
            if (!apiKey || !secretKey) {
                return {
                    status: 'error',
                    message: 'Not found API key or secret key.',
                }
            }

            await this.createExchange({ apiKey, secretKey })

            // Fetch positions พร้อมกับการ map symbol
            const symbols = orders.map((item) => item.symbol)
            const positions = await this.exchange.fetchPositions(symbols)

            const ords = positions
                .map((pos) => {
                    const result = orders.find(
                        (order) => order.symbol === pos.info.symbol,
                    )
                    if (!result) return null

                    return {
                        ...pos,
                        orderId: result.id,
                        type: result.type,
                        ...(result.type === 'EMA' && {
                            ema: result.ema,
                            timeframe: result.timeframe,
                        }),
                    }
                })
                .filter(Boolean)

            return {
                status: 'success',
                message: ords,
            }
        } catch (error) {
            throw error
        }
    }

    async createExchange(dto: Key) {
        this.exchange = new ccxt.binance({
            apiKey: dto.apiKey,
            secret: dto.secretKey,
            enableRateLimit: true,
            options: {
                defaultType: 'future',
            },
        })
    }

    private async getApiKeys(userId: string): Promise<Key> {
        return new Promise<Key>((resolve, reject) => {
            this.keyServiceClient.getKey({ userId }).subscribe({
                next: (response) =>
                    resolve({
                        apiKey: response.apiKey,
                        secretKey: response.secretKey,
                    }),
                error: (err) => reject(err),
            })
        })
    }

    async validateKey(dto: ValidateKeyDto): Promise<ExchangeResponse> {
        try {
            await this.createExchange(dto)
            await this.exchange.fetchBalance({ type: 'future' })

            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'API key or Secret key invalid.',
            }
        }
    }

    async balance(dto: BalanceDto): Promise<BalanceResponse> {
        try {
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            if (!apiKey || !secretKey) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'not found API Key or Secret Key',
                }
            }
            await this.createExchange({ apiKey, secretKey })

            const accountInfo = await this.exchange.fetchBalance({
                type: 'future',
            })
            const usdt = accountInfo.info['maxWithdrawAmount']
            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
                usdt,
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid API Key or Secret Key',
            }
        }
    }

    async createLimitBuyOrder(dto: createLimitOrderDto): Promise<void> {
        try {
            this.logger.debug('start long Process open position')
            if (!dto.userId) {
                throw new GrpcUnavailableException('Not found user.')
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            await this.createExchange({ apiKey, secretKey })
            await this.exchange.setLeverage(dto.leverage, dto.symbol)
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage
            await this.exchange.createLimitBuyOrder(
                dto.symbol,
                quantity,
                price.last,
                {
                    positionSide: 'LONG',
                },
            )
            this.logger.debug('OPEN long Position')
        } catch (error) {
            throw error
        }
    }

    async createLimitSellOrder(dto: createLimitOrderDto): Promise<void> {
        try {
            this.logger.debug('start short Process open position')
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            await this.createExchange({ apiKey, secretKey })
            await this.exchange.setLeverage(dto.leverage, dto.symbol)
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage
            await this.exchange.createLimitSellOrder(
                dto.symbol,
                quantity,
                price.last,
                {
                    positionSide: 'SHORT',
                },
            )
            this.logger.debug('OPEN short Position')
        } catch (error) {
            throw error
        }
    }

    async newClosePostion(dto: createLimitOrderDto): Promise<State> {
        try {
            this.logger.debug('start Process close position')
            if (!dto.userId) {
                return {
                    status: 'error',
                    message: 'Not found user.',
                }
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            if (!apiKey || !secretKey) {
                return {
                    status: 'error',
                    message: 'Not found API key or secret key.',
                }
            }
            console.log(apiKey, secretKey)
            // await this.createExchange({ apiKey, secretKey })
            // const price = await this.exchange.fetchTicker(dto.symbol)
            // const quantity = (dto.quantity / price.last) * dto.leverage

            // await this.exchange.createMarketBuyOrder(dto.symbol, quantity, {
            //     positionSide: 'SHORT',
            // })

            // if (dto.position === this.long) {
            //   // Close SHORT
            //   await this.exchange.createMarketBuyOrder(dto.symbol, quantity, { positionSide: this.short })
            // } else if (dto.position === this.short) {
            //   // Close LONG
            //   await this.exchange.createMarketSellOrder(dto.symbol, quantity, { positionSide: this.long })
            // }
            return {
                message: 'OK',
                status: 'success',
            }
        } catch (error) {
            throw error
        }
    }

    async closePosition(dto: createLimitOrderDto): Promise<void> {
        try {
            this.logger.debug('start Process close position')
            if (!dto.userId) {
                throw new GrpcUnavailableException('Not found user.')
            }
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            if (!apiKey || !secretKey) {
                throw new GrpcAlreadyExistsException(
                    'Not found API key or secret key.',
                )
            }
            await this.createExchange({ apiKey, secretKey })
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage

            // await this.exchange.createMarketBuyOrder(dto.symbol, quantity, {
            //     positionSide: 'SHORT',
            // })

            if (dto.position === 'Short') {
                // Close SHORT
                await this.exchange.createMarketBuyOrder(dto.symbol, quantity, {
                    positionSide: 'SHORT',
                })
            } else if (dto.position === 'Long') {
                // Close LONG
                await this.exchange.createMarketSellOrder(
                    dto.symbol,
                    quantity,
                    { positionSide: 'LONG' },
                )
            }
            this.logger.debug('Close position OK')
        } catch (error) {
            throw error
        }
    }
}
