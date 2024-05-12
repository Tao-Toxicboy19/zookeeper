import { EXCHANGE_PACKAGE_NAME, EXCHANGE_SERVICE_NAME, ExchangeServiceClient, KEY_PACKAGE_NAME, KEY_SERVICE_NAME, KeyServiceClient, OrderResponse, OrdersDto, PrismaService } from '@app/common';
import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name)
  private keyServiceClient: KeyServiceClient
  private exchangeServiceClient: ExchangeServiceClient

  constructor(
    private readonly prisma: PrismaService,
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
    @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
  }

  async create(dto: OrdersDto): Promise<OrderResponse> {
    const transaction = await this.prisma.$transaction(async (tx) => {
      const key = await tx.keys.findUnique({ where: { userId: dto.userId } })
      if (!key) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `don't have key`
        }
      }

      const { usdt } = await firstValueFrom(this.exchangeServiceClient.balance({ apiKey: key.apiKey, secretKey: key.secretKey }))

      if (dto.quantity >= +usdt) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Insufficient USDT balance'
        }
      }

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

      return {
        statusCode: HttpStatus.OK,
        message: 'OK'
      }
    })

    if (transaction.statusCode) {
      return {
        statusCode: transaction.statusCode,
        message: transaction.message
      }
    }
  }
}
