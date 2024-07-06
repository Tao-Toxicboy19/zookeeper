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
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as ccxt from 'ccxt';
import { Key } from './type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExchangeService implements OnModuleInit {
  private exchange: ccxt.Exchange
  private keyServiceClient: KeyServiceClient

  private readonly logger = new Logger(ExchangeService.name)

  constructor(
    @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
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
}
