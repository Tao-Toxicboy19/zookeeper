import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { OrderDto } from './dto'

@Injectable()
export class OrdersService {
    constructor(
        @Inject('ORDERS_SERVICE') private readonly client_tx: ClientProxy,
        @Inject('ORDER_QUERY_QUEUE') private readonly client_query: ClientProxy,
    ) { }

    async createOrder(dto: OrderDto): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client_tx.send<string>('create_order', dto).subscribe({
                next: (response) => {
                    resolve(response)
                },
                error: (err) => {
                    reject(err)
                },
            })
        })
    }

    async query(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client_query.send<string>('query_order', userId).subscribe({
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