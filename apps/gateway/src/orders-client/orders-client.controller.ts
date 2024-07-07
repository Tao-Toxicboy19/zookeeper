import { Body, Controller, Get, Logger, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { OrdersClientService } from './orders-client.service'
import { OrderDto } from './dto'
import { JwtAuthGuard, JwtPayload } from '@app/common'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'

@Controller('orders')
export class OrdersClientController {
    private readonly logger = new Logger(OrdersClientController.name)

    constructor(
        private readonly ordersClientService: OrdersClientService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload }
    ) {
        return await this.ordersClientService.createOrder({ ...dto, userId: '66878a7a4b14bfa599308738' })
        // return await this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
    }
}
