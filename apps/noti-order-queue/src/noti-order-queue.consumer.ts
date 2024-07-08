import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { NotiOrderQueueService } from './noti-order-queue.service';

@Injectable()
export class NotiOrderQueueConsumer implements OnModuleInit {
  private readonly channelWrapper: ChannelWrapper
  private readonly notiOrderQueue: string = 'noti_order_queue'
  private readonly logger: Logger = new Logger(NotiOrderQueueConsumer.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly notiOrderQueueService:NotiOrderQueueService
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
    this.channelWrapper.addSetup((channel: ConfirmChannel) => {
      channel.consume(this.notiOrderQueue, async (msg: ConsumeMessage) => {
        if (msg) {
          const message = JSON.parse(msg.content.toString())
          this.logger.debug(message)
          // await this.notiOrderQueueService.sendMail({
          //   email
          // })
          channel.ack(msg)
        }
      })
    })
  }
}
