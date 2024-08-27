import { Module } from '@nestjs/common'
import { ExchangeController } from './exchange.controller'
import { ExchangeService } from './exchange.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KEY_PACKAGE_NAME } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { RabbitmqConsumerService } from './rabbitmq/rabbitmq-consumer.service'
import { APP_FILTER } from '@nestjs/core'
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/exchange/.env',
        }),
        ClientsModule.registerAsync([
            {
                name: KEY_PACKAGE_NAME,
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: KEY_PACKAGE_NAME,
                        protoPath: join(__dirname, '../key.proto'),
                        url: configService.get<string>('KEY_SERVICE_URL'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'ORDERS_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('RABBITMQ_QUEUE_TX'),
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [ExchangeController],
    providers: [
        ExchangeService,
        RabbitmqConsumerService,
        {
            provide: APP_FILTER,
            useClass: GrpcServerExceptionFilter,
        },
    ],
})
export class ExchangeModule {}
