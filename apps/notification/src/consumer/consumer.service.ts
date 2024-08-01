import {
    Inject,
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import {
    AuthServiceClient
} from '@app/common'

type User = {
    user_id: string
    symbol: string
    leverage: number
    quantity: number
}

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly notificationOrderQueue: string = 'notification_order_queue'
    private readonly logger: Logger = new Logger(ConsumerService.name)
    private authServiceClient: AuthServiceClient

    constructor(
        private readonly configService: ConfigService,
        //   private readonly notificationService: NotificationService,
        //   @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertQueue('', { durable: true })
                this.logger.log('Queues set up successfully')
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
            channel.consume(this.notificationOrderQueue, async (msg: ConsumeMessage) => {
                if (msg) {
                    const { user_id, leverage, symbol, quantity }: User = JSON.parse(msg.content.toString())
                    // const { email } = await this.authServiceClient.getEmail({ userId: user_id }).toPromise()
                    // this.logger.debug(email)
                    // await this.notifyService.sendMail({ email, symbol, leverage, quantity, })
                    // this.logger.debug('send req ok')
                    channel.ack(msg)
                }
            })
        })
    }
}
