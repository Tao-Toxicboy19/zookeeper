import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateKeyDto, EXCHANGE_PACKAGE_NAME, EXCHANGE_SERVICE_NAME, ExchangeServiceClient, KeyResponse, PrismaService } from '@app/common';
import { randomUUID } from 'crypto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeyService implements OnModuleInit {
  private readonly logger = new Logger(KeyService.name)
  private exchangeServiceClient: ExchangeServiceClient

  constructor(
    private readonly prisma: PrismaService,
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc
  ) { }

  onModuleInit() {
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
  }

  async create(dto: CreateKeyDto): Promise<KeyResponse> {
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.keys.findUnique({ where: { userId: dto.userId } })

        if (existing) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: 'Keys already exist for this user'
          }
        }

        const validate = await firstValueFrom(this.exchangeServiceClient.validateKey({ apiKey: dto.apiKey, secretKey: dto.secretKey }))
        if (validate.statusCode !== 200) {
          return {
            statusCode: validate.statusCode,
            message: validate.message
          }
        }

        await tx.keys.create({
          data: {
            id: randomUUID(),
            userId: dto.userId,
            apiKey: dto.apiKey,
            secretKey: dto.secretKey,
            updatedAt: new Date()
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
    } catch (error) {
      throw error
    }
  }

}
