import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { OrderDto } from './dto';
import { JwtAuthGuard, JwtPayload } from '@app/common';

@Controller('orders')
export class OrdersClientController {
    private readonly logger = new Logger(OrdersClientController.name)
    private status: null | string

    constructor(
        private readonly ordersClientService: OrdersClientService,
    ) { }

    @Get()
    debug() {
        if (this.status === "hello") {
            this.status = "yeah"
        }
        if (this.status === "hello") {
            this.status = "wordl"
        }
        if (!this.status) {
            this.status = "hello"
        }
        return this.status
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload }
    ) {
        return await this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
    }
}
