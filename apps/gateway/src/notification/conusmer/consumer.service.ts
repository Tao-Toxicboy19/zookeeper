import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { NotificationService } from '../notification.service'
import { NotificationMsg } from '@app/common'
import { NotificationGateway } from '../notification.gateway'

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ConsumerService.name)
    private readonly channelWrapper: ChannelWrapper
    private readonly notificationOrderQueue: string = 'notification_order_queue'

    constructor(
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationService,
        private readonly notificationGateway: NotificationGateway,
    ) {
        const connection = amqp.connect([
            this.configService.get<string>('RABBITMQ_URL'),
        ])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.notificationOrderQueue, {
                    durable: true,
                })
                this.logger.debug('Queues set up successfully')
            },
        })

        connection.on('connect', () => {
            console.log('Connected to RabbitMQ')
            this.logger.debug('Connected to RabbitMQ')
        })

        connection.on('disconnect', (err) => {
            console.log('Disconnected from RabbitMQ:', err)
            this.logger.debug('Disconnected from RabbitMQ:', err)
        })
    }

    async onModuleInit() {
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume(
                this.notificationOrderQueue,
                async (msg: ConsumeMessage) => {
                    if (msg) {
                        const message: NotificationMsg = JSON.parse(
                            msg.content.toString(),
                        )
                        console.log(message)
                        await Promise.all([
                            this.notificationGateway.sendNotification(
                                message.msg,
                                message.user_id,
                            ),
                            this.notificationService.createMsg(message),
                        ])
                        channel.ack(msg)
                    }
                },
            )
        })
    }
}
