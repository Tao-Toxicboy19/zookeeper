import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from "@nestjs/common"
import { NotificationService } from "./notification.service";
import { JwtAuthGuard, JwtPayload } from "@app/common";

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Get()
    async notifications(
        @Req() req: { user: JwtPayload }
    ) {
        return this.notificationService.notifications(req.user.sub)
    }

    @Patch()
    async updateIsRead(
        @Req() req: { user: JwtPayload }
    ) {
        return this.notificationService.updateIsRead(req.user.sub)
    }

    @Delete(':id')
    async deleteNotification(
        @Param('id') id: string
    ) {
        return this.notificationService.deleteNotification(id)
    }
}