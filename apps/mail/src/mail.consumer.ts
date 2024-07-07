import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import amqp, { ChannelWrapper } from "amqp-connection-manager"
import { ConfirmChannel, ConsumeMessage } from "amqplib"
import { ObjectId } from "mongodb"
import { MailService } from "./mail.service"

export type User = {
    _id: string
    username: string
    password: string
    email: string
}

@Injectable()
export class MailConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly mailQueue: string = 'mail_queue'
    private readonly logger = new Logger(MailConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await channel.assertQueue(this.mailQueue, { durable: true })
                this.logger.log('Queues set up successfully')
            },
        })
    }

    async onModuleInit() {
        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume(this.mailQueue, async (msg: ConsumeMessage) => {
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
