import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';
import { OrderDto } from './dto';

@Controller('orders')
export class OrdersClientController {
    private readonly logger = new Logger(OrdersClientController.name)

    constructor(
        private readonly ordersClientService: OrdersClientService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Post('create')
    createOrder(
        @Body() dto: OrderDto,
        // @Req() req: { user: JwtPayload }
    ) {
        return this.ordersClientService.createOrder({ ...dto, userId: "81a048a1-41af-4d09-a8fd-2031a252c2fc" })
        // return this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
    }

    @Post('read')
    async findAll(page: number = 1, pageSize: number = 50) {
        // return await this.prisma.orders.deleteMany()
        // const skip = (page - 1) * pageSize;
        // return await this.prisma.orders.findMany({
        //     where: { userId: "81a048a1-41af-4d09-a8fd-2031a252c2fc" },
        //     skip: skip,
        //     take: pageSize,
        //     orderBy: {
        //         createdAt: 'desc',
        //     },
        //     select: {
        //         id: true,
        //         symbol: true,
        //         quantity: true,
        //         timeframe: true,
        //         type: true,
        //         ema: true,
        //         createdAt: true,
        //         updatedAt: true,
        //         leverage: true,
        //     },
        // });
    }
}
