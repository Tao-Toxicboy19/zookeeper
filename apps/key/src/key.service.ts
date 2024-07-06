import { BadRequestException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateKeyDto, EXCHANGE_PACKAGE_NAME, EXCHANGE_SERVICE_NAME, ExchangeServiceClient, KeyResponse } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { KeysRepository } from './key.repository';
import { GrpcAlreadyExistsException, GrpcInvalidArgumentException } from 'nestjs-grpc-exceptions';

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
      if (!key) throw new GrpcAlreadyExistsException('Keys invalid.')

      return {
        apiKey: key.apiKey,
        secretKey: key.secretKey
      }
    } catch (error) {
      throw error
    }
  }

  async create(dto: CreateKeyDto): Promise<KeyResponse> {

    try {
      const existKey = await this.keysRepository.findOne({ userId: dto.userId })
      if (existKey) throw new GrpcAlreadyExistsException('Keys already exist for this user.')

      const { apiKey, secretKey } = await this.getKey(dto.userId)
      const validate = await firstValueFrom(this.exchangeServiceClient.validateKey({ apiKey, secretKey }))
      if (validate.statusCode !== 200) throw new GrpcInvalidArgumentException(validate.message)

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
      throw error
    }
  }
}
