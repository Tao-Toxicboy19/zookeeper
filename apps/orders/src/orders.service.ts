import {
  EXCHANGE_PACKAGE_NAME,
  EXCHANGE_SERVICE_NAME,
  ExchangeServiceClient,
  OrderResponse,
  OrdersDto,
  PrismaService,
  SIGNAL_PACKAGE_NAME,
  SIGNAL_SERVICE_NAME,
  SignalServiceClient
} from '@app/common';
import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name)
  private exchangeServiceClient: ExchangeServiceClient
  private signalServiceClient: SignalServiceClient

  constructor(
    private readonly prisma: PrismaService,
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
    @Inject(SIGNAL_PACKAGE_NAME) private signalClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
    this.signalServiceClient = this.signalClient.getService<SignalServiceClient>(SIGNAL_SERVICE_NAME)
  }

  async queryOrders(symbol: string) {
    try {
      return await this.prisma.orders.findMany({
        where: {
          symbol: symbol
        },
        select: {
          symbol: true,
          quantity: true,
          leverage: true,
          Users: {
            select: {
              Keys: {
                select: {
                  apiKey: true,
                  secretKey: true
                }
              }
            }
          }
        },
      })
    } catch (error) {
      throw error
    }
  }

  async debug() {
    try {
      const orders = await this.prisma.orders.groupBy({
        by: [
          'symbol',
          'ema',
          'timeframe',
          'type'
        ]
      })

      if (!orders.length) return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'not found orders'
      }

      orders.map(async (item) => {
        const symbol = {
          ema: item.ema,
          symbol: item.symbol,
          timeframe: item.timeframe
        }
        if (item.type === 'EMA') {
          const value = await firstValueFrom(this.signalServiceClient.ema(symbol))
          if (value.positions) {
            const orders = await this.queryOrders(item.symbol)
            this.logger.debug(orders)
            /// Open Orders ////
          }
        } else if (item.type === 'CDC') {
          const value = await firstValueFrom(this.signalServiceClient.cdcActionZone(symbol))
          if (value.positions) {
            this.logger.debug(item.symbol)
          }
        }
      })

      return {
        statusCode: HttpStatus.OK,
        message: 'OK'
      }
    } catch (error: unknown) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error}`
      }
    }
  }

  async create(dto: OrdersDto): Promise<OrderResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const key = await tx.keys.findUnique({ where: { userId: dto.userId } })
        if (!key) {
          throw new Error(`Don't have key`)
        }
        const symbol = await tx.orders.findMany({
          where: {
            userId: dto.userId,
            symbol: dto.symbol
          }
        })
        if (symbol.length) {
          throw new Error(`You've got the symbol.`)
        }

        // const { usdt } = await firstValueFrom(
        //   this.exchangeServiceClient.balance({ apiKey: key.apiKey, secretKey: key.secretKey })
        // )

        // if (dto.quantity >= +usdt) {
        //   throw new Error('Insufficient USDT balance')
        // }

        await tx.orders.create({
          data: {
            id: randomUUID(),
            symbol: dto.symbol,
            quantity: dto.quantity,
            leverage: dto.leverage,
            timeframe: dto.timeframe,
            type: dto.type,
            ema: dto.ema !== null ? dto.ema : null,
            updatedAt: new Date(),
            userId: dto.userId
          }
        })
      })

      return {
        statusCode: HttpStatus.OK,
        message: 'OK'
      }
    } catch (error: unknown) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error}`
      }
    }
  }

  async findOrderWhereUserId() {
    try {
      const orders = await this.prisma.orders.findMany({
        where: { userId: "" },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          symbol: true,
          quantity: true,
          timeframe: true,
          type: true,
          ema: true,
          createdAt: true,
          leverage: true,
        },
      })
      return orders
    } catch (error: unknown) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error}`
      }
    }
  }
}

// const symbol = {
//   ema: 15,
//   symbol: 'BTCUSDT',
//   timeframe: '5m'
// }
// const data = await firstValueFrom(this.signalServiceClient.ema(symbol))
// this.logger.debug(data)


//// ไม่เอาแล้ว
//   const existSymbol = await tx.symbols.findUnique({ where: { symbol: dto.symbol } })
//   if (!existSymbol) {
//     await tx.symbols.create({
//       data: {
//         id: randomUUID(),
//         symbol: dto.symbol
//       }
//     })
//   }
/////////////////////////