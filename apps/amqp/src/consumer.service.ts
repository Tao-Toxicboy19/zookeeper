import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import amqp, { ChannelWrapper } from "amqp-connection-manager"
import { ConfirmChannel, ConsumeMessage } from "amqplib"
import { User } from "./connect.type"
import { MailService } from "./mail/mail.service"
import { ObjectId } from "mongodb"

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(ConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel()
    }

    async onModuleInit() {
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume('mail', async (msg: ConsumeMessage) => {
                channel.assertQueue('mail', { durable: true })
                channel.prefetch(2)
                if (msg) {
                    const content: User = JSON.parse(msg.content.toString())
                    await this.mailService.sendMail({
                        email: content.email,
                        message: JSON.stringify({
                            id: new ObjectId(content._id).toHexString(),
                            username: content.username
                        })
                    })
                    channel.ack(msg)
                }
            })
        })
    }
}
