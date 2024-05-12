import {
  EXCHANGE_PACKAGE_NAME,
  EXCHANGE_SERVICE_NAME,
  ExchangeServiceClient,
  INDICATOR_PACKAGE_NAME,
  INDICATOR_SERVICE_NAME,
  IndicatorServiceClient,
  OrderResponse,
  OrdersDto,
  PrismaService
} from '@app/common';
import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name)
  private exchangeServiceClient: ExchangeServiceClient
  private indicatorsServiceClient: IndicatorServiceClient

  constructor(
    private readonly prisma: PrismaService,
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
    @Inject(INDICATOR_PACKAGE_NAME) private indicatorClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
    this.indicatorsServiceClient = this.indicatorClient.getService<IndicatorServiceClient>(INDICATOR_SERVICE_NAME)
  }

  async create(dto: OrdersDto): Promise<OrderResponse> {
    try {
      const symbol = {
        ema: 1,
        symbol: 'BTCUSDT',
        timeframe: '5m'
      }
     const data =  await firstValueFrom(this.indicatorsServiceClient.fetchPrice(symbol))
     this.logger.debug(data)
      // await this.prisma.$transaction(async (tx) => {
      //   const key = await tx.keys.findUnique({ where: { userId: dto.userId } })
      //   if (!key) {
      //     throw new Error(`Don't have key`)
      //   }

      //   const { usdt } = await firstValueFrom(this.exchangeServiceClient.balance({ apiKey: key.apiKey, secretKey: key.secretKey }))

      //   if (dto.quantity >= +usdt) {
      //     throw new Error('Insufficient USDT balance')
      //   }

      //   await tx.orders.create({
      //     data: {
      //       id: randomUUID(),
      //       symbol: dto.symbol,
      //       quantity: dto.quantity,
      //       leverage: dto.leverage,
      //       timeframe: dto.timeframe,
      //       type: dto.type,
      //       ema: dto.ema !== null ? dto.ema : null,
      //       updatedAt: new Date(),
      //       userId: dto.userId
      //     }
      //   })
      // })

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
}
