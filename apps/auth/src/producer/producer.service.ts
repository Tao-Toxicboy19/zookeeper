import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class ProducerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(ProducerService.name)

    constructor(
        private readonly configService: ConfigService
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel()

        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ')
        })

        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err)
        })
    }

    async sendMessage(message: string) {
        const queueName = 'signup' // ชื่อคิวที่คุณต้องการส่งข้อความไป

        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            await channel.assertQueue(queueName, { durable: true })
            return channel.sendToQueue(queueName, Buffer.from(message), { persistent: true, })
        })
    }
}
