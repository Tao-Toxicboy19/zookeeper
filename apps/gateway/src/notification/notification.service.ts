import { NotificationMsg } from '@app/common'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response } from '@app/common'

@Injectable()
export class NotificationService {
    constructor(
        @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
    ) {}

    async notifications(userId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client
                .send<string>('notifications', { user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => {
                        // จัดการข้อผิดพลาดที่นี่
                        console.error(
                            'Error while fetching notifications:',
                            err,
                        )
                        reject(new Error('Failed to fetch notifications'))
                    },
                    complete: () =>
                        console.log('Notifications query completed'),
                })
        })
    }

    async updateIsRead(userId: string): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.client
                .send<Response>('update_isRead', { user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => {
                        // จัดการข้อผิดพลาดที่นี่
                        console.error(
                            'Error while updating notifications as read:',
                            err,
                        )
                        reject(
                            new Error('Failed to update notifications as read'),
                        )
                    },
                    complete: () =>
                        console.log('Update isRead query completed'),
                })
        })
    }

    async deleteNotification(id: string, userId: string): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.client
                .send<Response>('delete_notification', { id, user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => {
                        // จัดการข้อผิดพลาดที่นี่
                        console.error('Error while deleting notification:', err)
                        reject(new Error('Failed to delete notification'))
                    },
                    complete: () =>
                        console.log('Delete notification query completed'),
                })
        })
    }

    async createMsg(dto: NotificationMsg): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.client.send<Response>('create_msg_notify', dto).subscribe({
                next: (response) => resolve(response),
                error: (err) => {
                    // จัดการข้อผิดพลาดที่นี่
                    console.error(
                        'Error while creating notification message:',
                        err,
                    )
                    reject(new Error('Failed to create notification message'))
                },
                complete: () =>
                    console.log('Create message notification query completed'),
            })
        })
    }
}
