import { BadRequestException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateKeyDto, EXCHANGE_PACKAGE_NAME, EXCHANGE_SERVICE_NAME, ExchangeServiceClient, KeyResponse, PrismaService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { KeysRepository } from './key.repository';

@Injectable()
export class KeyService implements OnModuleInit {
  private readonly logger = new Logger(KeyService.name)
  private exchangeServiceClient: ExchangeServiceClient

  constructor(
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
    private readonly keysRepository: KeysRepository,
  ) { }

  onModuleInit() {
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
  }

  async getKey(userId: string): Promise<KeyResponse> {
    try {
      const key = await this.keysRepository.findOne({ userId })
      if (!key) {
        throw new BadRequestException()
      }
      return {
        apiKey: key.apiKey,
        secretKey: key.secretKey
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `${error}`
      }
    }
  }

  async create(dto: CreateKeyDto): Promise<KeyResponse> {

    try {
      const existKey = await this.keysRepository.findOne({ userId: dto.userId })
      if (existKey) {
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

      await this.keysRepository.create({
        createdAt: new Date(),
        apiKey: dto.apiKey,
        secretKey: dto.secretKey,
        userId: dto.userId
      })
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Key created successfully',
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `${error}`
      }
    }
  }
}
