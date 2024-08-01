
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { MailDto } from './dto/notification.dto'
import { NotificationRepository } from './notification.repository';
import { Nofitication } from './types/notification.type';
import { NotificationMsg } from '@app/common';

@Injectable()
export class NotificationService {

    constructor(
        private readonly mailerService: MailerService,
        private readonly notificationRepository: NotificationRepository,
    ) { }

    async sendMail(dto: MailDto) {
        try {
            const options = {
                to: dto.email,
                subject: `open position symbol: ${dto.symbol}`,
                html: `<h1>open position ${dto.symbol} leverage: ${dto.leverage}</h1>`,
            }
            await this.mailerService.sendMail(options)
        } catch (error) {
            throw error
        }
    }

    async notifications(userId: string): Promise<Nofitication[]> {
        try {
            return await this.notificationRepository.find({ user_id: userId }) as Nofitication[]
        } catch (error) {
            throw error
        }
    }

    async updateIsRead(userId: string): Promise<string> {
        try {
            await this.notificationRepository.updateMany(
                { user_id: userId },
                {
                    isRead: true,
                    readedAt: new Date()
                }
            )

            return 'OK'
        } catch (error) {
            throw error
        }
    }

    async deleteNotification(id: string): Promise<string> {
        try {
            console.log(id)
            await this.notificationRepository.deleteOne({ _id: id })
            return 'OK'
        } catch (error) {
            throw error
        }
    }

    async createNotification({ user_id, msg }: NotificationMsg): Promise<string> {
        try {
            await this.notificationRepository.create({
                user_id,
                msg,
                createdAt: new Date(),
            })
            console.log('create succ')
            return 'OK'
        } catch (error) {
            throw error
        }
    }
}
