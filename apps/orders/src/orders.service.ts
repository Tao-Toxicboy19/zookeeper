import { KEY_PACKAGE_NAME, KEY_SERVICE_NAME, KeyServiceClient, OrdersDto, PrismaService } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name)
  private keyServiceClient: KeyServiceClient

  constructor(
    private readonly prisma: PrismaService,
    @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
  }

  async create(dto: OrdersDto): Promise<void> {
    this.logger.debug('hello from Order Service')
    await firstValueFrom(this.keyServiceClient.createKey({ apiKey: '123', secretKey: '123', userId: '123' }))
    // await this.prisma.orders.create({
    //   data: {
    //     id: randomUUID(),
    //     symbol: dto.symbol,
    //     quantity: dto.quantity,
    //     leverage: dto.leverage,
    //     timeframe: dto.timeframe,
    //     type: dto.type,
    //     ema: dto.ema !== null ? dto.ema : null,
    //     updatedAt: new Date(),
    //     userId: dto.userId
    //   }
    // })
  }
}
