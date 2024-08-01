import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common'
import {
  CreateKeyDto,
  EXCHANGE_PACKAGE_NAME,
  EXCHANGE_SERVICE_NAME,
  ExchangeResponse,
  ExchangeServiceClient,
  KeyResponse
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { KeysRepository } from './key.repository'
import { GrpcAlreadyExistsException, GrpcInvalidArgumentException } from 'nestjs-grpc-exceptions'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class KeyService implements OnModuleInit {
  private readonly logger = new Logger(KeyService.name)
  private exchangeServiceClient: ExchangeServiceClient

  constructor(
    @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
    private readonly keysRepository: KeysRepository,
    private readonly jwtService: JwtService,
  ) { }

  onModuleInit() {
    this.exchangeServiceClient = this.exchangeClient.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
  }

  async getKey(userId: string): Promise<KeyResponse> {
    try {
      const key = await this.keysRepository.findOne({ userId })
      if (!key) throw new GrpcInvalidArgumentException('Keys invalid.')

      return {
        apiKey: key.apiKey,
        secretKey: key.secretKey
      }
    } catch (error) {
      throw error
    }
  }

  private async encypt(value: string, secret: string): Promise<string> {
    try {
      return await this.jwtService.signAsync(value, { secret })
    } catch (error) {
      throw error
    }
  }

  async create(dto: CreateKeyDto): Promise<KeyResponse> {

    try {
      const existKey = await this.keysRepository.findOne({ userId: dto.userId })
      if (existKey) {
        console.log('hello world')
        throw new GrpcAlreadyExistsException('Keys already exist for this user.')
      }

      const validate = await new Promise<ExchangeResponse>((resolve, reject) => {
        this.exchangeServiceClient.validateKey({ apiKey: dto.apiKey, secretKey: dto.secretKey })
          .subscribe({
            next: (response) => resolve(response),
            error: (err) => reject(err)
          })
      })
      if (validate.statusCode !== 200) {
        throw new GrpcInvalidArgumentException(validate.message)
      }

      await this.keysRepository.create({
        createdAt: new Date(),
        apiKey: await this.encypt(dto.apiKey, dto.seedPhrase),
        secretKey: await this.encypt(dto.secretKey, dto.seedPhrase),
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
