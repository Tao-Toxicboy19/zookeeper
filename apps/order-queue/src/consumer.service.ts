// order.consumer.ts
import { ClientGrpc } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import {
    Inject,
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common'
import amqp, {
    ChannelWrapper
} from 'amqp-connection-manager'
import {
    ConfirmChannel,
    ConsumeMessage
} from 'amqplib'
import {
    BalanceResponse,
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeServiceClient
} from '@app/common'
import { CreateLimit } from './types/createLimit.type'

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly orderFutureQueue: string = 'order_future_queue'
    private readonly notifyQueue: string = 'notification_order_queue'
    private readonly positionQueue: string = 'close_position_queue'
    private readonly logger: Logger = new Logger(ConsumerService.name)
    private exchangeServiceClient: ExchangeServiceClient

    constructor(
        private readonly configService: ConfigService,
        @Inject(EXCHANGE_PACKAGE_NAME) private clientEx: ClientGrpc,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBITMQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.notifyQueue, { durable: true })
                await channel.assertQueue(this.orderFutureQueue, { durable: true })
                await channel.assertQueue(this.positionQueue, { durable: true })
                this.logger.debug('Queues set up successfully')
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
        this.exchangeServiceClient = this.clientEx.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            // Handle positionQueue
            channel.consume(this.positionQueue, async (msg: ConsumeMessage) => {
                if (msg) {
                    const order: CreateLimit = JSON.parse(msg.content.toString())
                    this.logger.debug('hello close position')
                    // process Close position task
                    await this.handleClosePositionTask('')

                    channel.ack(msg)

                    await this.processOrderFutureTasks(channel)
                }
            })

            // Handle orderFutureQueue separately
            // channel.consume(this.orderFutureQueue, async (msg: ConsumeMessage) => {
            //     if (msg) {
            //         // this.pendingOrders.push(JSON.parse(msg.content.toString())); // เก็บ order ไว้ใน pendingOrders
            //         this.logger.debug('hello from future')
            //         channel.ack(msg)
            //     }
            // });
        })
    }

    async sendTask(queue: string, msg: string) {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.sendToQueue(queue, Buffer.from(msg), { persistent: true })
        })
    }

    async handleClosePositionTask(task: string): Promise<void> {
        // Simulate task processing with delay
        console.log("Close Position Task:", task)
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    async processOrderFutureTasks(channel: ConfirmChannel): Promise<void> {
        try {
            // Check if positionQueue is empty
            const positionStatus = await channel.checkQueue(this.positionQueue)

            if (positionStatus.messageCount === 0) {
                // Process all pending orders in orderFutureQueue
                while (true) {
                    const msg = await channel.get(this.orderFutureQueue)
                    if (msg) {
                        const order: CreateLimit = JSON.parse(msg.content.toString())
                        // this.logger.debug(msg)
                        // this.logger.debug('Processing order from order_future_queue:', order)
                        this.logger.debug('hello future from close')
                        // Call your function to handle the order
                        // await this.handleOrderFutureTasks(order)

                        // Acknowledge the message
                        channel.ack(msg)
                    } else {
                        // No more messages in order_future_queue
                        break
                    }
                }
            }
        } catch (error) {
            this.logger.error('Error processing order future tasks', error)
        }
    }


    async handleOrderFutureTasks(dto: CreateLimit): Promise<void> {
        try {
            const { usdt } = await new Promise<BalanceResponse>((resolve, reject) => {
                this.exchangeServiceClient.balance({ userId: dto.order.user_id }).subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
            })

            if (+usdt < dto.order.quantity) {
                this.logger.debug('Insufficient funds')
                // Send notification
                const message = {
                    msg: `Insufficient funds ==> open position: ${dto.position} ==> ${dto.order.symbol}`,
                    user_id: dto.order.user_id,
                }
                await this.sendTask(this.notifyQueue, JSON.stringify(message))
            } else if (dto.position === 'Long') {
                const message = {
                    msg: `open position: ${dto.position} ==> ${dto.order.symbol}`,
                    user_id: dto.order.user_id,
                }
                await Promise.all([
                    new Promise<void>((resolve, reject) => {
                        this.exchangeServiceClient.createLimitBuy({
                            id: dto.order.id,
                            symbol: dto.order.symbol,
                            leverage: dto.order.leverage,
                            quantity: dto.order.quantity,
                            userId: dto.order.user_id,
                            position: 'LONG',
                        }).subscribe({
                            next: () => resolve(),
                            error: (err) => reject(err),
                        })
                    }),
                    this.sendTask(this.notifyQueue, JSON.stringify(message))
                ])
            } else if (dto.position === 'Short') {
                const message = {
                    msg: `open position: ${dto.position} ==> ${dto.order.symbol}`,
                    user_id: dto.order.user_id,
                }
                await Promise.all([
                    new Promise<void>((resolve, reject) => {
                        this.exchangeServiceClient.createLimitSell({
                            id: dto.order.id,
                            symbol: dto.order.symbol,
                            leverage: dto.order.leverage,
                            quantity: dto.order.quantity,
                            userId: dto.order.user_id,
                            position: 'SHORT',
                        }).subscribe({
                            next: () => resolve(),
                            error: (err) => reject(err),
                        })
                    }),
                    this.sendTask(this.notifyQueue, JSON.stringify(message))
                ])
            }
        } catch (error) {
            this.logger.error('Error handler order future tasks', error)
        }
    }
}
