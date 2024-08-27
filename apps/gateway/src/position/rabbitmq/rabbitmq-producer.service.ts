import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'

@Injectable()
export class RabbitmqProducerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(RabbitmqProducerService.name)

    constructor(private readonly configService: ConfigService) {
        const connection = amqp.connect([
            this.configService.get<string>('RABBITMQ_URL'),
        ])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: Channel) => {
                await Promise.all([
                    channel.assertQueue('usdt-queue'),
                    channel.assertQueue('position-queue'),
                ])
            },
        })

        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ')
        })

        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err)
        })
    }

    async publish(queue: string, msg: string) {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.sendToQueue(queue, Buffer.from(msg))
        })
    }
}
