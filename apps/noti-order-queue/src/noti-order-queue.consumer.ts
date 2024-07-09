import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { NotiOrderQueueService } from './noti-order-queue.service'
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'

type User = {
  user_id: string
  symbol: string
  leverage: number
  quantity: number
}

@Injectable()
export class NotiOrderQueueConsumer implements OnModuleInit {
  private readonly channelWrapper: ChannelWrapper
  private readonly notiOrderQueue: string = 'noti_order_queue'
  private readonly logger: Logger = new Logger(NotiOrderQueueConsumer.name)
  private authServiceClient: AuthServiceClient

  constructor(
    private readonly configService: ConfigService,
    private readonly notifyService: NotiOrderQueueService,
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
  ) {
    const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
    this.channelWrapper = connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.notiOrderQueue, { durable: true })
        this.logger.log('Queues set up successfully')
      },
    })
  }

  async onModuleInit() {
    this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)

    this.channelWrapper.addSetup((channel: ConfirmChannel) => {
      channel.consume(this.notiOrderQueue, async (msg: ConsumeMessage) => {
        if (msg) {
          const { user_id, leverage, symbol, quantity }: User = JSON.parse(msg.content.toString())
          const { email } = await this.authServiceClient.getEmail({ userId: user_id }).toPromise()
          this.logger.debug(email)
          await this.notifyService.sendMail({ email, symbol, leverage, quantity, })
          this.logger.debug('send req ok')
          channel.ack(msg)
        }
      })
    })
  }
}
