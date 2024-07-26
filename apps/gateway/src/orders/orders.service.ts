import { OrdersDto } from '@app/common'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { OrderDto } from './dto'

@Injectable()
export class OrdersService {
    constructor(
        @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    ) { }

    async createOrder(dto: OrderDto): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.send<string>('create_order', dto).subscribe({
                next: (response) => {
                    resolve(response)
                },
                error: (err) => {
                    reject(err)
                },
            })
        })
    }
}