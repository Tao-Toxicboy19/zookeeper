import {
  BalanceDto,
  BalanceResponse,
  ExchangeResponse,
  KEY_PACKAGE_NAME,
  KEY_SERVICE_NAME,
  KeyServiceClient,
  ValidateKeyDto
} from '@app/common';
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common'
import {
  ClientGrpc,
  ClientKafka
} from '@nestjs/microservices'
import * as ccxt from 'ccxt'
import { Key } from './type'
import { createLimitOrderDto } from './dto/create-limit-order.dto'
import { Admin, Kafka } from '@nestjs/microservices/external/kafka.interface';
import { KafkaProducerService } from './producer/kafka-producer.service'

@Injectable()
export class ExchangeService implements OnModuleInit {
  private exchange: ccxt.Exchange
  private keyServiceClient: KeyServiceClient
  private readonly long: string = "LONG"
  private readonly short: string = "SHORT"
  private readonly positionTopic: string = 'position-topic'

  private readonly logger: Logger = new Logger(ExchangeService.name)

  constructor(
    @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
    private readonly kafkaProducerService: KafkaProducerService,
  ) { }



  async onModuleInit() {
    this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
  }

  async debug(): Promise<void> {
    console.log('send topic success');
    return this.kafkaProducerService.publish({ msg: 'hello world kafka' });
  }

  async createExchange(dto: Key) {
    this.exchange = new ccxt.binance({
      apiKey: dto.apiKey,
      secret: dto.secretKey,
      'enableRateLimit': true,
      options: {
        defaultType: "future",
      },
    })
  }

  private async getApiKeys(userId: string): Promise<Key> {
    const { apiKey, secretKey } = await this.keyServiceClient.getKey({ userId }).toPromise()
    return { apiKey, secretKey }
  }

  async validateKey(dto: ValidateKeyDto): Promise<ExchangeResponse> {
    try {
      await this.createExchange(dto)
      await this.exchange.fetchBalance({ type: 'future' })

      return {
        statusCode: HttpStatus.OK,
        message: 'OK'
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'api key and secret key invalid'
      }
    }
  }

  async balance(dto: BalanceDto): Promise<BalanceResponse> {
    try {
      const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
      await this.createExchange({ apiKey, secretKey })

      const accountInfo = await this.exchange.fetchBalance({ type: 'future' })
      const usdt = accountInfo.info['maxWithdrawAmount']

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        usdt: usdt
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid API Key or Secret Key'
      }
    }
  }

  async createLimitBuyOrder(dto: createLimitOrderDto): Promise<void> {
    try {
      this.logger.debug('send message to kafka success')
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
          positionSide: this.long
        }
      )

    } catch (error) {
      throw error
    }
  }

  async createLimitSellOrder(dto: createLimitOrderDto): Promise<void> {
    try {
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
          positionSide: this.short
        }
      )
    } catch (error) {
      throw error
    }
  }

  async closePosition(dto: createLimitOrderDto): Promise<void> {
    try {
      const { apiKey, secretKey } = await this.getApiKeys(dto.userId)
      await this.createExchange({ apiKey, secretKey })
      const price = await this.exchange.fetchTicker(dto.symbol)
      const quantity = (dto.quantity / price.last) * dto.leverage

      // if (dto.position === this.long) {
      //     // Close SHORT
      //     await this.exchange.createMarketBuyOrder(dto.symbol, quantity, { positionSide: this.short })
      // } else if (dto.position === this.short) {
      //     // Close LONG
      //     await this.exchange.createMarketSellOrder(dto.symbol, quantity, { positionSide: this.long })
      // }
    } catch (error) {
      throw error
    }
  }

}
