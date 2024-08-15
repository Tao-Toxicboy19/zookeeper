import {
    Controller,
    Delete,
    Get,
    HttpException,
    Inject,
    Logger,
    LoggerService,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { JwtAuthGuard, JwtPayload } from '@app/common'
import { Request } from 'express'

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    private handleSuccess(message: string, req: Request, userId?: string) {
        this.logger.log(message, NotificationController.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            user_id: userId,
        })
    }

    private handleError(
        message: string,
        error: any,
        req: Request,
        userId?: string,
    ) {
        this.logger.error(message, error.stack, NotificationController.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            statusCode: 500,
            user_id: userId,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        })
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async notifications(
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
    ) {
        try {
            const response = await this.notificationService.notifications(
                req.user.sub,
            )
            this.handleSuccess(
                'query notification successful.',
                request,
                req.user.sub,
            )
            return response
        } catch (error) {
            this.handleError(
                'Failed to query notification.',
                error,
                request,
                req.user.sub,
            )
            throw error
        }
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateIsRead(
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
    ) {
        try {
            const response = await this.notificationService.updateIsRead(
                req.user.sub,
            )
            if (response.statusCode !== 200) {
                this.handleError(
                    'Failed to update notification.',
                    response.error,
                    request,
                    req.user.sub,
                )
                throw new HttpException(response.message, response.statusCode)
            }
            this.handleSuccess(
                'update notification successful.',
                request,
                req.user.sub,
            )
            return response
        } catch (error) {
            this.handleError(
                'Failed to update notification.',
                error,
                request,
                req.user.sub,
            )
            throw error
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteNotification(
        @Param('id') id: string,
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
    ) {
        try {
            const response = await this.notificationService.deleteNotification(
                id,
                req.user.sub,
            )
            if (response.statusCode !== 200) {
                this.handleError(
                    'Failed to update notification.',
                    response.error,
                    request,
                    req.user.sub,
                )
                throw new HttpException(response.message, response.statusCode)
            }
            this.handleSuccess(
                'update notification successful.',
                request,
                req.user.sub,
            )
            return response
        } catch (error) {
            this.handleError(
                'Failed to update notification.',
                error,
                request,
                req.user.sub,
            )
            throw error
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req: { user: JwtPayload }, @Req() request: Request) {
        try {
            const response = await this.notificationService.createMsg({
                user_id: req.user.sub,
                msg: 'hello world',
            })

            if (response.statusCode !== 200) {
                this.handleError(
                    'Failed to create notification.',
                    response.error,
                    request,
                    req.user.sub,
                )
                throw new HttpException(response.message, response.statusCode)
            }
            this.handleSuccess(
                'update notification successful.',
                request,
                req.user.sub,
            )
            return response
        } catch (error) {
            this.handleError(
                'Failed to update notification.',
                error,
                request,
                req.user.sub,
            )
            throw error
        }
    }
}
