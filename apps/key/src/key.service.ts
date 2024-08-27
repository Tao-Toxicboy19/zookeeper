import {
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common'
import {
    CreateKeyDto,
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeResponse,
    ExchangeServiceClient,
    KeyResponse,
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'
import { KeysRepository } from './key.repository'
import {
    GrpcAlreadyExistsException,
    GrpcInvalidArgumentException,
} from 'nestjs-grpc-exceptions'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import { ObjectId } from 'mongodb'

@Injectable()
export class KeyService implements OnModuleInit {
    private readonly logger = new Logger(KeyService.name)
    private exchangeServiceClient: ExchangeServiceClient

    constructor(
        @Inject(EXCHANGE_PACKAGE_NAME) private exchangeClient: ClientGrpc,
        private readonly keysRepository: KeysRepository,
        private readonly jwtService: JwtService,
    ) {}

    onModuleInit() {
        this.exchangeServiceClient =
            this.exchangeClient.getService<ExchangeServiceClient>(
                EXCHANGE_SERVICE_NAME,
            )
    }

    async getKey(userId: string): Promise<KeyResponse> {
        try {
            console.log(userId)
            const secret = await this.keysRepository.findOne({ userId })
            if (!secret) {
                return {
                    statusCode: 404,
                    message: 'not found key',
                }
            }
            return {
                apiKey: secret.apiKey,
                secretKey: secret.secretKey,
            }
        } catch (error) {
            throw error
        }
    }

    async create(dto: CreateKeyDto): Promise<KeyResponse> {
        try {
            const existKey = await this.keysRepository.findOne({
                userId: dto.userId,
            })
            if (existKey) {
                throw new GrpcAlreadyExistsException(
                    'Keys already exist for this user.',
                )
            }

            const validate = await new Promise<ExchangeResponse>(
                (resolve, reject) => {
                    this.exchangeServiceClient
                        .validateKey({
                            apiKey: dto.apiKey,
                            secretKey: dto.secretKey,
                        })
                        .subscribe({
                            next: (response) => resolve(response),
                            error: (err) => reject(err),
                        })
                },
            )
            if (validate.statusCode !== 200) {
                throw new GrpcInvalidArgumentException(validate.message)
            }

            const result = {
                _id: new Types.ObjectId(),
                createdAt: new Date(),
                apiKey: dto.apiKey,
                secretKey: dto.secretKey,
                userId: new Types.ObjectId(dto.userId),
            }

            await this.keysRepository.create(result)

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Key created successfully',
            }
        } catch (error) {
            throw error
        }
    }
}
