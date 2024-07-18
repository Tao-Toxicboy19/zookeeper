import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Req,
    UseGuards
} from '@nestjs/common'
import { OrderDto } from './dto'
import {
    JwtAuthGuard,
    JwtPayload
} from '@app/common'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name)

    constructor(
        private readonly ordersService: OrdersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload }
    ) {
        return await this.ordersService.createOrder({ ...dto, userId: req.user.sub })
    }
}
