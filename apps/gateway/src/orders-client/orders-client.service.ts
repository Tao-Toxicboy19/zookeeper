import { ORDERS_PACKAGE_NAME, ORDERS_SERVICE_NAME, OrderResponse, OrdersDto, OrdersServiceClient } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersClientService implements OnModuleInit {
    private ordersServiceClient: OrdersServiceClient

    constructor(
        @Inject(ORDERS_PACKAGE_NAME) private client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.ordersServiceClient = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME)
    }

    async createOrder(request: OrdersDto): Promise<OrderResponse> {
        try {
            return await firstValueFrom(this.ordersServiceClient.createOrder(request))
        } catch (error) {
            throw error
        }
    }
}
