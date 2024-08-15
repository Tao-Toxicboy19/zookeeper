import { MailerService } from '@nestjs-modules/mailer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { MailDto } from './dto'
import { NotificationRepository } from './notification.repository'
import { Notifications } from './types'
import { NotificationMsg, Response } from '@app/common'
import { Types } from 'mongoose'

@Injectable()
export class NotificationService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async sendMail(dto: MailDto): Promise<void> {
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

    async notifications(userId: string): Promise<Notifications | Response> {
        try {
            // แปลง userId จาก string เป็น ObjectId
            const objectId = new Types.ObjectId(userId)

            const result = (await this.notificationRepository.findOne({
                userId: objectId,
            })) as Notifications

            console.log(result)
            if (!result) {
                return {
                    message: 'No documents found to read.',
                    error: 'No Content.',
                    statusCode: HttpStatus.NO_CONTENT,
                }
            }

            return result
        } catch (error) {
            throw error
        }
    }

    // อัปเดตการทำงานเพื่อให้เหมาะสมกับการอัปเดตฟิลด์ใน array
    async updateNotificationsAsRead(userId: string): Promise<Response> {
        try {
            const result = await this.notificationRepository.updateMany(
                { userId: userId, 'notifications.isReaded': false }, // Filter query
                {
                    $set: {
                        'notifications.$[elem].isReaded': true, // Set isReaded to true
                        'notifications.$[elem].readedAt': new Date(), // Set readedAt to current date
                    },
                },
                {
                    arrayFilters: [{ 'elem.isReaded': false }], // Array filters
                    multi: true, // Apply the update to all matching elements
                },
            )
            if (!result.length) {
                return {
                    message: 'No documents found to update.',
                    error: 'No Content.',
                    statusCode: HttpStatus.NO_CONTENT,
                }
            }
            return {
                message: 'OK',
                statusCode: HttpStatus.OK,
            }
        } catch (error) {
            throw error // สามารถโยนข้อผิดพลาดต่อไปหากต้องการ
        }
    }

    async createNotification({
        user_id,
        msg,
    }: NotificationMsg): Promise<Response> {
        try {
            const result = {
                _id: new Types.ObjectId(),
                msg: msg,
                isReaded: false,
                createdAt: new Date(),
                readedAt: null,
                deletedAt: null,
            }

            // ขั้นตอนที่ 1: สร้างเอกสารใหม่ถ้ายังไม่มี
            await this.notificationRepository.upsert(
                { userId: user_id },
                {
                    $set: { userId: user_id }, // อัปเดตฟิลด์ที่มีอยู่
                    $push: {
                        notifications: result,
                    }, // เพิ่ม notification ใหม่
                },
            )

            return {
                message: 'OK',
                statusCode: 200,
            }
        } catch (error) {
            throw error
        }
    }

    async deleteNotificationItem(
        userId: string,
        notificationItemId: string,
    ): Promise<Response> {
        const result = await this.notificationRepository.updateMany(
            { userId: userId }, // Filter query
            {
                $pull: {
                    notifications: {
                        _id: new Types.ObjectId(notificationItemId),
                    },
                },
            },
        )

        if (!result.length) {
            return {
                message: 'NotificationItem not found to delete.',
                error: 'NOT FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            }
        }
        return {
            message: 'OK',
            statusCode: HttpStatus.OK,
        }
    }
}
