import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';
import { OrderDto } from './dto';
import { JwtPayload } from '@app/common';

@Controller('orders-client')
export class OrdersClientController {
  private readonly logger = new Logger(OrdersClientController.name)

  constructor(private readonly ordersClientService: OrdersClientService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createOrder(
    @Body() dto: OrderDto,
    @Req() req: { user: JwtPayload }
  ) {
    return this.ordersClientService.createOrder({ ...dto, userId: req.user.sub })
  }
}
