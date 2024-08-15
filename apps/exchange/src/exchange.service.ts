import {
    BalanceDto,
    BalanceResponse,
    ExchangeResponse,
    KEY_PACKAGE_NAME,
    KEY_SERVICE_NAME,
    KeyServiceClient,
    SendUserIdDto,
    ValidateKeyDto,
} from '@app/common'
import {
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import * as ccxt from 'ccxt'
import { Key } from './type'
import { createLimitOrderDto } from './dto/create-limit-order.dto'
import { KafkaProducerService } from './producer/kafka-producer.service'
import { verify } from 'jsonwebtoken'

@Injectable()
export class ExchangeService implements OnModuleInit {
    private exchange: ccxt.Exchange
    private keyServiceClient: KeyServiceClient
    private readonly long: string = 'LONG'
    private readonly short: string = 'SHORT'

    private readonly logger: Logger = new Logger(ExchangeService.name)

    constructor(
        @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
        private readonly kafkaProducerService: KafkaProducerService,
    ) {}

    async onModuleInit() {
        this.keyServiceClient =
            this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    }

    async encypt(value: string, secret: string): Promise<string> {
        return verify(value, secret) as string
    }

    async position({ userId }: SendUserIdDto): Promise<void> {
        try {
            const { apiKey, secretKey } = await this.getApiKeys(userId)
            await this.createExchange({
                apiKey,
                secretKey,
            })
            const position = await this.exchange.fetchPositions()
            console.log(position)
            // this.kafkaProducerService.publish(
            //     JSON.stringify({
            //         user_id: userId,
            //         position,
            //     }),
            // )
            if (position.length !== 0) {
                this.kafkaProducerService.publish(
                    JSON.stringify({
                        user_id: userId,
                        position,
                    }),
                )
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
                message: 'api key and secret key invalid',
            }
        }
    }

    async balance(dto: BalanceDto): Promise<BalanceResponse> {
        try {
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            await this.createExchange({ apiKey, secretKey })

            const accountInfo = await this.exchange.fetchBalance({
                type: 'future',
            })
            const usdt = accountInfo.info['maxWithdrawAmount']

            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
                usdt: usdt,
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
            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            await this.createExchange({ apiKey, secretKey })
            await this.exchange.setLeverage(dto.leverage, dto.symbol)
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage
            await this.exchange.createLimitBuyOrder(
                dto.symbol,
                quantity,
                price.last,
                // {
                //   positionSide: 'LONG'
                // }
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
            await this.exchange.setLeverage(75, dto.symbol)
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage
            await this.exchange.createLimitSellOrder(
                dto.symbol,
                quantity,
                price.last,
                // {
                //   positionSide: 'SHORT'
                // }
            )
            this.logger.debug('OPEN short Position')
        } catch (error) {
            throw error
        }
    }

    async closePosition(dto: createLimitOrderDto): Promise<void> {
        try {
            this.logger.debug('start Process close position')

            const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
            await this.createExchange({ apiKey, secretKey })
            const price = await this.exchange.fetchTicker(dto.symbol)
            const quantity = (dto.quantity / price.last) * dto.leverage

            await this.exchange.createMarketBuyOrder(dto.symbol, quantity, {
                positionSide: 'SHORT',
            })

            // if (dto.position === this.long) {
            //   // Close SHORT
            //   await this.exchange.createMarketBuyOrder(dto.symbol, quantity, { positionSide: this.short })
            // } else if (dto.position === this.short) {
            //   // Close LONG
            //   await this.exchange.createMarketSellOrder(dto.symbol, quantity, { positionSide: this.long })
            // }
            this.logger.debug('Close position OK')
        } catch (error) {
            throw error
        }
    }
}
