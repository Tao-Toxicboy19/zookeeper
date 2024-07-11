// order.consumer.ts
import { ClientGrpc } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import {
    Inject,
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import {
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeServiceClient
} from '@app/common'
import axios from 'axios'

export type CreateLimit = {
    position: string
    order: Order
}

export type Order = {
    ID: string
    Symbol: string
    Quantity: number
    Timeframe: string
    Type: string
    Ema: number
    CreatedAt: Date
    UpdatedAt: Date
    DeletedAt: null
    Leverage: number
    user_id: string
    Status: null
}

@Injectable()
export class OrderQueueConsumer implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly orderQueue: string = 'order_future_queue'
    private readonly orderUpdateQueue: string = 'order_update_queue'
    private readonly notiOrderQueue: string = 'noti_order_queue'
    private readonly logger: Logger = new Logger(OrderQueueConsumer.name)
    private exchangeServiceClient: ExchangeServiceClient

    constructor(
        private readonly configService: ConfigService,
        @Inject(EXCHANGE_PACKAGE_NAME) private client: ClientGrpc,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.orderQueue, { durable: true })
                this.logger.log('Queues set up successfully')
            },
        })
    }

    async onModuleInit() {
        this.exchangeServiceClient = this.client.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume(this.orderQueue, async (msg: ConsumeMessage) => {
                if (msg) {
                    const order: CreateLimit = JSON.parse(msg.content.toString())
                    this.logger.debug(order)
                    await Promise.all([
                        this.setLineNotify(JSON.stringify({
                            timeframe: order.order.Timeframe,
                            symbol: order.order.Symbol,
                            type: order.order.Type,
                            EMA: order.order.Ema,
                            position:order.position
                        }))
                        // this.sendTask(
                        //     this.orderUpdateQueue,
                        //     JSON.stringify({
                        //         status: order.position,
                        //         id: order.order.ID
                        //     })
                        // ),
                        // this.sendTask(
                        //     this.notiOrderQueue,
                        //     JSON.stringify({
                        //         user_id: order.order.user_id,
                        //         symbol: order.order.Symbol,
                        //         leverage: order.order.Leverage,
                        //         quantity: order.order.Quantity,
                        //     })
                        // ),
                        // this.process(order)
                    ])
                    channel.ack(msg)
                }
            })
        })
    }

    async process(dto: CreateLimit): Promise<void> {
        try {
            if (dto.position === 'Long') {
                await this.exchangeServiceClient.createLimitBuy({
                    id: dto.order.ID,
                    symbol: dto.order.Symbol,
                    leverage: dto.order.Leverage,
                    quantity: dto.order.Quantity,
                    userId: dto.order.user_id,
                    position: dto.position
                }).toPromise()
            } else if (dto.position === 'Short') {
                await this.exchangeServiceClient.createLimitSell({
                    id: dto.order.ID,
                    symbol: dto.order.Symbol,
                    leverage: dto.order.Leverage,
                    quantity: dto.order.Quantity,
                    userId: dto.order.user_id,
                    position: dto.position
                }).toPromise()
            }
        } catch (error) {
            throw error
        }
    }

    async sendTask(queue: string, msg: string) {
        await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.sendToQueue(queue, Buffer.from(msg), { persistent: true, })
        })
    }

    async setLineNotify(message: string): Promise<void> {
        try {
            await axios.post(
                'https://notify-api.line.me/api/notify',
                { message },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer 41U6HJq0N1chNIjynWGCp5BEIbrABjEQX15DcUrBoSd`,
                    },
                }
            )
        } catch (error) {
            throw error
        }
    }
}