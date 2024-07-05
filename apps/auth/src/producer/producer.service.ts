import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class ProducerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(ProducerService.name)

    constructor(
        private readonly configService: ConfigService
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: Channel) => {
                Promise.all([
                    channel.assertQueue('signup', { durable: true }),
                    channel.assertQueue('mail', { durable: true })
                ])
            }
        })

        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ')
        })

        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err)
        })
    }

    async sendMsg(queue: string, msg: string) {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.sendToQueue(queue, Buffer.from(msg), { persistent: true, })
        })
    }
}
