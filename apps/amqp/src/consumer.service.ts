import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib"
import { MAIL_PACKAGE_NAME, MAIL_SERVICE_NAME, MailServiceClient, PrismaService } from "@app/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { User } from "./connect.type";

@Injectable()
export class ConsumerService implements OnModuleInit {
    private mailServiceClient: MailServiceClient
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(ConsumerService.name)

    constructor(
        private readonly prisma: PrismaService,
        @Inject(MAIL_PACKAGE_NAME) private mailClient: ClientGrpc,
        private readonly configService: ConfigService,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel()
    }

    async onModuleInit() {
        this.mailServiceClient = this.mailClient.getService<MailServiceClient>(MAIL_SERVICE_NAME)

        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            channel.consume('signup', async (msg: ConsumeMessage) => {
                channel.assertQueue('signup', { durable: true })
                channel.prefetch(2)
                if (msg) {
                    const content: User = JSON.parse(msg.content.toString())
                    await firstValueFrom(
                        this.mailServiceClient.sendMail({
                            mail: content.email,
                            message: JSON.stringify({
                                id: content.id,
                                username: content.username
                            })
                        })
                    )
                    await this.prisma.users.create({
                        data: {
                            id: content.id,
                            username: content.username,
                            password: content.password,
                            email: content.email,
                            updatedAt: new Date()
                        }
                    })
                    channel.ack(msg)
                }
            })
        })

        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume('mail', async (msg: ConsumeMessage) => {
                channel.assertQueue('mail', { durable: true })
                channel.prefetch(2)
                if (msg) {
                    const content: User = JSON.parse(msg.content.toString())
                    await firstValueFrom(
                        this.mailServiceClient.sendMail({
                            mail: content.email,
                            message: JSON.stringify({
                                id: content.id,
                                username: content.username
                            })
                        }))
                    channel.ack(msg)
                }
            })
        })
    }
}
