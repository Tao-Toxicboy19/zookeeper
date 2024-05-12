import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createExchangeDto } from '@app/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangeService implements OnModuleInit {
  private exchange: ccxt.Exchange
  private readonly logger = new Logger(ExchangeService.name)

  onModuleInit() { }

  createExchange(dto: createExchangeDto) {
    this.exchange = new ccxt.binance({
      apiKey: dto.apiKey,
      secret: dto.secretKey,
      'enableRateLimit': true,
      options: {
        defaultType: "future",
      },
    })
  }

}
