import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { NotificationService } from './notification.service'
import { NotificationMsg, userId } from '@app/common'
import { Nofitication } from './types/notification.type'

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @EventPattern('notifications')
    handleNotifications(dto: userId): Promise<Nofitication[]> {
        return this.notificationService.notifications(dto.user_id)
    }

    @EventPattern('update_isRead')
    handleUpdateIsRead(dto: userId): Promise<void> {
        return this.notificationService.updateIsRead(dto.user_id)
    }

    @EventPattern('delete_notification')
    handleDeleted(dto: { id: string }): Promise<void> {
        return this.notificationService.deleteNotification(dto.id)
    }

    @EventPattern('create_msg_notify')
    handleCreateMsg(dto: NotificationMsg): Promise<void> {
        return this.notificationService.createNotification(dto)
    }
}
