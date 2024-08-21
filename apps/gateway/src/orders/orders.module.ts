import { Logger, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CustomLoggerService } from '../utils/custom-logger.service'

@Module({
    imports: [
        ClientsModule.registerAsync([
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
    controllers: [OrdersController],
    providers: [
        OrdersService,
        GrpcToHttpInterceptor,
        {
            provide: Logger,
            useClass: CustomLoggerService,
        },
    ],
})
export class OrdersModule {}
