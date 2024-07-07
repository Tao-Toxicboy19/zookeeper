import { RedisService } from '@app/common'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { MailDto } from './dto/mail.dto'

type User = {
  id: string
  username: string
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}


  async sendMail(dto: MailDto) {
    const user: User = JSON.parse(dto.message)
    try {
      const otp = await this.generateOTP()
      const mailOptions = {
        to: dto.email,
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

  private async generateOTP(): Promise<number> {
    return Math.floor(1000 + Math.random() * 9000)
  }

}
