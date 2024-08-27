import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { ExchangeService } from '../exchange.service'
import { OpenPosition } from '../type/open-position.type'

@Injectable()
export class RabbitmqConsumerService {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(RabbitmqConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly exchangeService: ExchangeService,
    ) {
        const connection = amqp.connect([
            this.configService.get<string>('RABBITMQ_URL'),
        ])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await Promise.all([
                    channel.assertQueue('open-position-queue', {
                        durable: true,
                    }),
                    channel.assertQueue('close-position', {
                        durable: true,
                    }),

                    channel.assertExchange('usdt-exchange', 'direct'), // สร้าง exchange
                    channel.assertQueue('usdt-queue'), // สร้างคิวและ bind กับ exchange ด้วย routing key
                    channel.bindQueue(
                        'usdt-queue',
                        'usdt-exchange',
                        'usdt-routing-key',
                    ),

                    channel.assertExchange('position-exchange', 'direct'),
                    channel.assertQueue('position-queue'),
                    channel.bindQueue(
                        'position-queue',
                        'position-exchange',
                        'position-routing-key',
                    ),
                ])

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
            channel.consume('usdt-queue', async (msg: ConsumeMessage) => {
                try {
                    if (msg) {
                        const content: UserId = JSON.parse(
                            msg.content.toString(),
                        )
                        const wallet = await this.exchangeService.balance({
                            userId: content.userId,
                        })

                        // ส่งข้อความไปยัง exchange
                        channel.publish(
                            'usdt-exchange',
                            'usdt-routing-key',
                            Buffer.from(
                                JSON.stringify({
                                    userId: content.userId,
                                    ...wallet,
                                }),
                            ),
                        )
                        channel.ack(msg)
                    }
                } catch (error) {
                    this.logger.error(
                        'Error consuming message from usdt-queue:',
                        error,
                    )
                }
            })

            channel.consume('position-queue', async (msg: ConsumeMessage) => {
                try {
                    if (msg) {
                        const content: UserId = JSON.parse(
                            msg.content.toString(),
                        )
                        const position = await this.exchangeService.position({
                            userId: content.userId,
                        })

                        if (position.status === 'success') {
                            channel.publish(
                                'position-exchange',
                                'position-routing-key',
                                Buffer.from(
                                    JSON.stringify({
                                        userId: content.userId,
                                        ...position,
                                    }),
                                ),
                            )
                        }
                        channel.ack(msg)
                    }
                } catch (error) {
                    this.logger.error(
                        'Error consuming message from position-queue:',
                        error,
                    )
                }
            })

            channel.consume(
                'open-position-queue',
                async (msg: ConsumeMessage) => {
                    try {
                        if (msg) {
                            const content: OpenPosition = JSON.parse(
                                msg.content.toString(),
                            )
                            if (content.status === 'Long') {
                                await this.exchangeService.createLimitBuyOrder({
                                    userId: content.userId,
                                    symbol: content.symbol,
                                    quantity: content.quantity,
                                    leverage: content.leverage,
                                })
                            } else if (content.status === 'Short') {
                                await this.exchangeService.createLimitSellOrder(
                                    {
                                        userId: content.userId,
                                        symbol: content.symbol,
                                        quantity: content.quantity,
                                        leverage: content.leverage,
                                    },
                                )
                            }
                            channel.ack(msg)
                        }
                    } catch (error) {
                        this.logger.error(
                            'Error consuming message from open-position-queue:',
                            error,
                        )
                    }
                },
            )

            channel.consume('close-position', async (msg: ConsumeMessage) => {
                try {
                    if (msg) {
                        const content: OpenPosition = JSON.parse(
                            msg.content.toString(),
                        )
                        await this.exchangeService.closePosition({
                            userId: content.userId,
                            leverage: content.leverage,
                            quantity: content.quantity,
                            symbol: content.symbol,
                            position: content.status,
                        })
                        channel.ack(msg)
                    }
                } catch (error) {
                    this.logger.error(
                        'Error consuming message from open-position-queue:',
                        error,
                    )
                }
            })
        })
    }
}
