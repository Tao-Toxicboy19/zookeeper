import { SendMailDto } from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

type User = {
  id: string
  username: string
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) { }

  onModuleInit() { }

  async sendMail(dto: SendMailDto) {
    const user: User = JSON.parse(dto.message)
    try {
      const otp = await this.generateOTP()
      const mailOptions = {
        to: dto.mail,
        subject: 'Test Email',
        html: `<h1>Your OTP is: ${otp}</h1>`,
      }
      await Promise.all([
        this.mailerService.sendMail(mailOptions),
        this.redisService.setKey(user.id, 300, JSON.stringify({ otp, user }))
      ])
      
    } catch (error) {
      throw error
    }
  }

  async generateOTP(): Promise<number> {
    const otp = Math.floor(1000 + Math.random() * 9000)
    return otp
  }
}
