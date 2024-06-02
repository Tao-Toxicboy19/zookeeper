import {
  INDICATOR_PACKAGE_NAME,
  INDICATOR_SERVICE_NAME,
  IndicatorServiceClient,
  SignalDto,
  SignalResponse
} from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as ccxt from 'ccxt'

@Injectable()
export class SignalService implements OnModuleInit {
  private readonly logger = new Logger(SignalService.name)
  private readonly statusFile = 'status.json'
  private indicatorsServiceClient: IndicatorServiceClient
  private exchange: ccxt.Exchange


  constructor(
    @Inject(INDICATOR_PACKAGE_NAME) private indicatorClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.exchange = new ccxt.binance();
    this.indicatorsServiceClient = this.indicatorClient.getService<IndicatorServiceClient>(INDICATOR_SERVICE_NAME)
  }

  async calulate(data: any[], ema: number) {
    return await firstValueFrom(this.indicatorsServiceClient.calulateEma({ price: data, ema }))
  }

  async setLineNotify(message: string): Promise<void> {
    try {
      await axios.post(
        'https://notify-api.line.me/api/notify',
        { message },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer 41U6HJq0N1chNIjynWGCp5BEIbrABjEQX15DcUrBoSd`,
          },
        }
      )
    } catch (error) {
      throw error
    }
  }

  getStatus() {
    try {
      const data = fs.readFileSync(this.statusFile, "utf8")
      const status = JSON.parse(data)
      return {
        isLong: status.isLong || '',
        isShort: status.isShort || ''
      }
    } catch (error) {
      return { isLong: '', isShort: '' };
    }
  }

  saveStatus(isLong: string, isShort: string) {
    fs.writeFileSync(
      this.statusFile,
      JSON.stringify({
        isLong,
        isShort,
      }),
      "utf8"
    );
  }

  async cdcActionZone() {
    try {
      const ohlcv = await this.exchange.fetchOHLCV("BTC/USDT", "5m", undefined, 50)
      const data = ohlcv.map((data) => data[4])

      const [ema12, ema26] = await Promise.all([
        this.calulate(data, 12),
        this.calulate(data, 26)
      ])
      let values = this.getStatus();
      console.log(values);
      // let isLong;
      // let isShort;

    } catch (error) {
      throw error
    }
  }

  async ema(dto: SignalDto): Promise<SignalResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await firstValueFrom(this.indicatorsServiceClient.fetchPrice(dto))
      const data = JSON.parse(response.candles).slice(0, -1).map((data: any[]) => parseFloat(data[4]))

      const [emaCurrentDay, emaPreviousDay] = await Promise.all([
        this.calulate(data, 15),
        this.calulate(data.slice(0, -1), 15)
      ])

      const isGoldenCross = emaPreviousDay.ema > emaPreviousDay.lastPrice && emaCurrentDay.ema < emaCurrentDay.lastPrice
      const isDeathCross = emaPreviousDay.ema < emaPreviousDay.lastPrice && emaCurrentDay.ema > emaCurrentDay.lastPrice

      if (isGoldenCross) {
        await this.setLineNotify(`Open LONG EMA`)
        return {
          positions: [
            {
              position: "LONG"
            }
          ]
        }
      }

      if (isDeathCross) {
        await this.setLineNotify(`Open SHORT EMA`)
        return {
          positions: [
            {
              position: "SHORT"
            }
          ]
        }
      }
      await this.setLineNotify(`don't have signal`)

      return { positions: [] }

    } catch (error) {
      throw error
    }
  }
}
