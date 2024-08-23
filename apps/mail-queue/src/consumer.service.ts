import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import amqp, { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { ObjectId } from 'mongodb'
import { MailerService } from '@nestjs-modules/mailer'
import { RedisService } from '@app/common'
import { MailDto } from './dto/mail-queue.dto'
import { ForgotPassword, User } from './types'

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly otpMailQueue: string = 'otp_mail_queue'
    private readonly resetPassswordQueue: string = 'reset_password_queue'
    private readonly logger = new Logger(ConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
        private readonly redisService: RedisService,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBITMQ_URL')])
        this.channelWrapper = connection.createChannel({
            setup: async (channel: ConfirmChannel) => {
                await Promise.all([
                    channel.assertQueue(this.resetPassswordQueue, { durable: true }),
                    channel.assertQueue(this.otpMailQueue, { durable: true })
                ])
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
            channel.consume(this.otpMailQueue, async (msg: ConsumeMessage) => {
                if (msg) {
                    const content: User = JSON.parse(msg.content.toString())
                    await this.handleSendOtp({
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

        this.channelWrapper.addSetup((channel: ConfirmChannel) => {
            channel.consume(this.resetPassswordQueue, async (msg: ConsumeMessage) => {
                if (msg) {
                    const { email, token }: ForgotPassword = JSON.parse(msg.content.toString())
                    await this.handleSendResetPassword(email, token)
                    channel.ack(msg)
                }
            })
        })
    }

    async handleSendResetPassword(email: string, token: string): Promise<void> {
        const resetUrl = `${this.configService.get<string>('RESET_PASSWORD_URL')}/${token}`
        await this.mailerService.sendMail({
            to: email,
            subject: 'Zookeeper Password Reset Request',
            text: `Please click on the following link to reset your password: ${resetUrl}`,
        })
    }

    async handleSendOtp(dto: MailDto) {
        const user: {
            id: string
            username: string
        } = JSON.parse(dto.message)
        try {
            const otp = await this.generateOTP()
            await Promise.all([
                this.mailerService.sendMail({
                    to: dto.email,
                    subject: 'Test Email',
                    html: `<h1>Your OTP is: ${otp}</h1>`,
                }),
                this.redisService.setKey(user.id, 300, JSON.stringify({ otp, user }))
            ])

        } catch (error) {
            throw error
        }
    }

    private async generateOTP(): Promise<number> {
        return Math.floor(1000 + Math.random() * 9000)
    }
}
