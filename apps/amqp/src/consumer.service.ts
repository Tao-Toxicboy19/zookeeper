import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib"
import { MAIL_PACKAGE_NAME, MAIL_SERVICE_NAME, MailServiceClient } from "@app/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "./prisma/prisma.service";
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
                try {
                    channel.assertQueue('signup', { durable: true })
                    channel.prefetch(2)
                    if (msg) {
                        const connect: User = JSON.parse(msg.content.toString())
                        await firstValueFrom(
                            this.mailServiceClient.sendMail({
                                mail: connect.email,
                                message: JSON.stringify({
                                    id: connect.id,
                                    username: connect.username
                                })
                            })
                        )
                        await this.prisma.users.create({
                            data: {
                                id: connect.id,
                                username: connect.username,
                                password: connect.password,
                                email: connect.email,
                                updated_at: new Date()
                            }
                        })
                        channel.ack(msg)
                    }
                } catch (error) {
                    this.logger.error(error)
                    throw error
                }
            })
        })
    }
}
