import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { NotificationService } from './notification.service'
import { NotificationMsg, userId, Response } from '@app/common'
import { Notifications } from './types'

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @EventPattern('notifications')
    handleNotifications(dto: userId): Promise<Notifications> {
        return this.notificationService.notifications(dto.user_id)
    }

    @EventPattern('update_isRead')
    handleUpdateIsRead(dto: userId): Promise<Response> {
        return this.notificationService.updateNotificationsAsRead(dto.user_id)
    }

    @EventPattern('create_msg_notify')
    handleCreateMsg(dto: NotificationMsg): Promise<Response> {
        return this.notificationService.createNotification(dto)
    }

    @EventPattern('delete_notification')
    handleDeleted(dto: { id: string; user_id: string }): Promise<Response> {
        return this.notificationService.deleteNotificationItem(
            dto.user_id,
            dto.id,
        )
    }
}
