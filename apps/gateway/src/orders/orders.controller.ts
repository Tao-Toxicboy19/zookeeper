import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    LoggerService,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { OrderDto } from './dto'
import { JwtAuthGuard, JwtPayload } from '@app/common'
import { OrdersService } from './orders.service'
import { Request } from 'express'
import { UserIdDto } from './dto/userId.dto'

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    private handleSuccess(message: string, req: Request, userId?: string) {
        this.logger.log(message, OrdersController.name, {
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
        this.logger.error(message, error.stack, OrdersController.name, {
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

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
    ) {
        try {
            const msg = await this.ordersService.createOrder({
                ...dto,
                userId: req.user.sub,
            })

            // this.handleSuccess('create order successful', request, req.user.sub)
            return {
                message: msg,
                statusCode: 200,
            }
        } catch (error) {
            // this.handleError('Failed to create order', error, request)
            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('query')
    async query(@Req() req: { user: JwtPayload }, @Req() request: Request) {
        try {
            if (req.user.sub) {
                throw new NotFoundException('Not found user.')
            }
            this.handleSuccess('query order successful', request, req.user.sub)
            return await this.ordersService.query(req.user.sub)
        } catch (error) {
            this.handleError('Failed to query order', error, request)
            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('close-position')
    async closePosition(
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
        @Query('id') id: string,
    ) {
        try {
            return await this.ordersService.closePosition({
                userId: req.user.sub,
                orderId: id,
            })
        } catch (error) {
            throw error
        }
    }
}
