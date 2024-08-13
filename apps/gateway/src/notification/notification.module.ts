import { Logger, Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationGateway } from './notification.gateway'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NotificationController } from './notification.controller'
import { ConsumerService } from './conusmer/consumer.service'
import { CustomLoggerService } from '../utils/custom-logger.service'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'NOTIFICATION_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('NOTIFY_QUEUE'),
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [NotificationController],
    providers: [
        NotificationGateway,
        NotificationService,
        ConsumerService,
        {
            provide: Logger,
            useClass: CustomLoggerService,
        },
    ],
})
export class NotificationModule {}
