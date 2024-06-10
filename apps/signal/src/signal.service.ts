import {
  SignalDto,
  SignalResponse
} from '@app/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as ccxt from 'ccxt'
import { InjectRepository } from '@nestjs/typeorm';
import { Positions } from './entities/positions.entity';
import { Repository } from 'typeorm';

type Position = {
  symbol: string
  position: string
  type: string
}

@Injectable()
export class SignalService implements OnModuleInit {
  private readonly logger = new Logger(SignalService.name)
  private exchange: ccxt.Exchange


  constructor(
    @InjectRepository(Positions)
    private readonly positionRepository: Repository<Positions>,
  ) { }

  onModuleInit() {
    this.exchange = new ccxt.binance();
  }
  async calculate(data: number[], ema: number) {
    try {
      if (data.length < ema) return null;

      const k = 2 / (ema + 1);
      let emaValue = data.slice(0, ema).reduce((acc, val) => acc + val, 0) / ema;

      for (let i = ema; i < data.length; i++) {
        emaValue = (data[i] - emaValue) * k + emaValue;
      }

      return {
        ema: emaValue,
        lastPrice: data[data.length - 1],
      };
    } catch (error) {
      throw error;
    }
  }

  // return await firstValueFrom(this.indicatorsServiceClient.calulateEma({ price: data, ema }))

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

  async saveSymbol(symbol: string, type: string): Promise<Positions> {
    try {
      let posi = await this.positionRepository.findOne({
        where: {
          symbol,
          type
        }
      })
      if (!posi) {
        posi = await this.positionRepository.save({
          symbol,
        })
      }
      return posi
    } catch (error) {
      throw error
    }
  }

  async updatePosition(dto: Position): Promise<void> {
    try {
      await this.positionRepository.update({
        symbol: dto.symbol
      }, {
        position: dto.position,
        type: dto.type,
      })
    } catch (error) {
      throw error
    }
  }

  async cdcActionZone(dto: SignalDto): Promise<SignalResponse> {
    try {
      const ohlcv = await this.exchange.fetchOHLCV(dto.symbol, dto.timeframe, undefined, 52)
      const data = ohlcv.map((data) => data[4])
      const [ema12, ema26] = await Promise.all([
        this.calculate(data, 12),
        this.calculate(data, 26)
      ])

      const posi = await this.saveSymbol(dto.symbol, 'CDC')

      // Short
      if (ema26.ema > ema12.ema) {
        await this.updatePosition({ symbol: dto.symbol, position: 'Long', type: 'CDC' })
        if (posi.position === 'Short' || ema12.ema > ema26.ema) {
          return { positions: 'Short' }
        }
      }

      //Long
      if (ema12.ema > ema26.ema) {
        await this.updatePosition({ symbol: dto.symbol, position: 'Short', type: 'CDC' })
        this.logger.debug(posi.position)
        if (posi.position === 'Long' || ema26.ema > ema12.ema) {
          return { positions: 'Long' }
        }
      }

      return { positions: null }

    } catch (error) {
      throw error
    }
  }

  async ema(dto: SignalDto): Promise<SignalResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const ohlcv = await this.exchange.fetchOHLCV(dto.symbol, dto.timeframe, undefined, 52)
      const data = ohlcv.map((data) => data[4])
      // const response = await firstValueFrom(this.indicatorsServiceClient.fetchPrice(dto))
      // const data = JSON.parse(response.candles).slice(0, -1).map((data: any[]) => parseFloat(data[4]))

      const [emaCurrentDay, emaPreviousDay] = await Promise.all([
        this.calculate(data, 15),
        this.calculate(data.slice(0, -1), 15)
      ])

      const posi = await this.saveSymbol(dto.symbol, 'EMA')

      if (emaPreviousDay.ema > emaPreviousDay.lastPrice) {
        await this.updatePosition({ symbol: dto.symbol, position: 'Short', type: 'EMA' })
        if (posi.position === 'Long' || emaCurrentDay.ema < emaCurrentDay.lastPrice)
          await this.setLineNotify(`Open LONG EMA`)
        return {
          positions: 'Long'
        }
      }

      if (emaPreviousDay.ema < emaPreviousDay.lastPrice) {
        await this.updatePosition({ symbol: dto.symbol, position: 'Long', type: 'EMA' })
        if (posi.position === 'Short' || emaCurrentDay.ema > emaCurrentDay.lastPrice)
          await this.setLineNotify(`Open SHORT EMA`)
        return {
          positions: 'Short'
        }
      }
      await this.setLineNotify(`don't have signal`)

      return { positions: '' }

    } catch (error) {
      throw error
    }
  }
}
