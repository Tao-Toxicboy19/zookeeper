import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class ProducerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly mailQueue: string = 'mail_queue'
    private readonly logger = new Logger(ProducerService.name)

    constructor(
        private readonly configService: ConfigService
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: Channel) => {
                Promise.all([
                    channel.assertQueue(this.mailQueue, { durable: true })
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

    async sendMsg(msg: string) {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.sendToQueue(this.mailQueue, Buffer.from(msg), { persistent: true, })
        })
    }
}
