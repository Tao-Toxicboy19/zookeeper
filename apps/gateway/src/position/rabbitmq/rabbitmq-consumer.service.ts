import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { PositionGateway } from '../position.gateway'
import { Wallet } from '../types/emit-event.type'
import { Position } from '../types/position.type'

@Injectable()
export class RabbitmqConsumerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(RabbitmqConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly positionGateway: PositionGateway,
    ) {
        const connection = amqp.connect([
            this.configService.get<string>('RABBITMQ_URL'),
        ])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertExchange('position-exchange', 'direct')
                await channel.assertQueue('position-queue')
                await channel.bindQueue(
                    'position-queue',
                    'position-exchange',
                    'position-routing-key',
                )

                this.logger.debug('Exchange and Queue set up successfully')
            },
        })

        connection.on('connect', () => {
            this.logger.debug('Connected to RabbitMQ')
        })

        connection.on('disconnect', (err) => {
            this.logger.debug('Disconnected from RabbitMQ:', err)
        })
    }

    async onModuleInit() {
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume('position-queue', async (msg: ConsumeMessage) => {
                if (msg) {
                    const content: Position = JSON.parse(msg.content.toString())
                    // console.log(content)
                     if (content.status === 'success') {
                        this.positionGateway.handleEmitEvent({
                            userId: content.userId,
                            msg: {
                                message: content.message,
                            },
                            event: 'event-position',
                        })
                    } else {
                        this.positionGateway.handleEmitEvent({
                            userId: content.userId,
                            msg: 'load position.',
                            event: 'event-position',
                        })
                    }
                    channel.ack(msg)
                }
            })
        })
    }
}
