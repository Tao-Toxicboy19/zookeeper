import { NotificationMsg } from '@app/common'
import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

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
                    error: (err) => reject(err),
                })
        })
    }

    async updateIsRead(userId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client
                .send<void>('update_isRead', { user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
        })
    }

    async deleteNotification(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.send('delete_notification', { id }).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            })
        })
    }

    async createMsg(dto: NotificationMsg): Promise<void> {
        try {
            new Promise<void>((resolve, reject) => {
                this.client.send<void>('create_msg_notify', dto).subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
            })
        } catch (error) {
            throw error
        }
    }
}
