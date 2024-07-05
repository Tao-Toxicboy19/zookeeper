import {
  BalanceResponse,
  ExchangeResponse,
  ValidateKeyDto
} from '@app/common';
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangeService implements OnModuleInit {
  private exchange: ccxt.Exchange
  private readonly logger = new Logger(ExchangeService.name)

  constructor(
  ) { }

  onModuleInit() { }

  async createExchange(dto: { apiKey: string, secretKey: string }) {
    this.exchange = new ccxt.binance({
      apiKey: dto.apiKey,
      secret: dto.secretKey,
      'enableRateLimit': true,
      options: {
        defaultType: "future",
      },
    })
  }

  // private async getApiKeys(userId: string): Promise<{ apiKey: string; secret: string }> {
  //   const apiKey = await this.prisma.keys.findUnique({ where: { userId: userId } })
  //   // this.exchange.watchPositionForSymbols
  //   return { apiKey: apiKey.apiKey, secret: apiKey.secretKey }
  // }

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

  async balance(dto: ValidateKeyDto): Promise<BalanceResponse> {
    try {
      await this.createExchange(dto)

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
