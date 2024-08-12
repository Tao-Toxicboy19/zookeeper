import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { JwtAuthGuard, JwtPayload } from '@app/common'

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async notifications(@Req() req: { user: JwtPayload }) {
        return this.notificationService.notifications(req.user.sub)
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateIsRead(@Req() req: { user: JwtPayload }) {
        return this.notificationService.updateIsRead(req.user.sub)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteNotification(@Param('id') id: string) {
        return this.notificationService.deleteNotification(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req: { user: JwtPayload }) {
        return await this.notificationService.createMsg({
            user_id: req.user.sub,
            msg: 'hello world',
        })
        // try {
        //     await this.notificationService.createMsg({
        //         user_id: req.user.sub,
        //         msg: 'hello world',
        //     })
        //     return { message: 'Notification created successfully' }
        // } catch (error) {
        //     // Log the error or handle it as necessary
        //     throw new Error(`Failed to create notification: ${error.message}`)
        // }
    }
}
