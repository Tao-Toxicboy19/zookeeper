import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { OrderDto } from './dto';
import { JwtAuthGuard, JwtPayload, PrismaService } from '@app/common';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersClientController {
    private readonly logger = new Logger(OrdersClientController.name)
    private status: null | string

    constructor(
        private readonly ordersClientService: OrdersClientService,
        private readonly prisma: PrismaService
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

    // @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() dto: OrderDto,
        @Req() req: { user: JwtPayload }
    ) {
        let result = await firstValueFrom(this.ordersClientService.createOrder({ ...dto, userId: '163d8bfb-ccd8-4fbd-812e-3cc41c79ed21' }))
        console.log(result)
        return result
        // return this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
    }

    @Post('read')
    async findAll(page: number = 1, pageSize: number = 50) {
        return await this.prisma.orders.deleteMany({ where: { id: 'a137ae21-bab3-4636-bf39-06c868659041' } })
        // return await this.prisma.orders.groupBy({
        //     by: [
        //         'symbol',
        //         'ema',
        //         'timeframe',
        //         'type'
        //     ]
        // })
        // return await this.prisma.orders.findMany()
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
