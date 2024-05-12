import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { JwtAuthGuard } from '../auth-client/jwt-auth.guard';
import { OrderDto } from './dto';

@Controller('orders-client')
export class OrdersClientController {
  private readonly logger = new Logger(OrdersClientController.name)

  constructor(private readonly ordersClientService: OrdersClientService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Body() dto: OrderDto,
    @Req() req: { user: { sub: string, username: string } }
  ) {
    return this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
  }
}
