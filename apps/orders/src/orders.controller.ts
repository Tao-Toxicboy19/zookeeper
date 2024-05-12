import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersServiceController } from '@app/common';
import { OrdersDto, OrdersServiceControllerMethods } from '@app/common/types/orders';

@Controller()
@OrdersServiceControllerMethods()
export class OrdersController implements OrdersServiceController {
  constructor(private readonly ordersService: OrdersService) { }

  createOrder(request: OrdersDto) {
    return this.ordersService.create(request)
  }
}
