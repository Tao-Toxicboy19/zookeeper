import {
    Body,
    Controller,
    Logger,
    Post,
    Req,
    UseGuards
} from '@nestjs/common'
import { OrdersClientService } from './orders-client.service'
import { OrderDto } from './dto'
import {
    JwtAuthGuard,
    JwtPayload
} from '@app/common'

@Controller('orders')
export class OrdersClientController {
    private readonly logger = new Logger(OrdersClientController.name)

    constructor(
        private readonly ordersClientService: OrdersClientService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload }
    ) {
        return await this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
    }
}
