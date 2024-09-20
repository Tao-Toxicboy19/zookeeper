import { userId } from './../../../../libs/common/src/types/notifications/notification'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { OrderDto } from './dto'
import { Cron } from '@nestjs/schedule'

type Order = {
    user_id: string
    id: string
}

@Injectable()
export class OrdersService {
    constructor(
        @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    ) {}

    async createOrder(dto: OrderDto): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.send<string>('create_order', dto).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            })
        })
    }

    async query(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client
                .send<string>('query_order', { user_id: userId })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
        })
    }

    async closePosition({
        userId,
        orderId,
    }: {
        userId: string
        orderId: string
    }): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client
                .send<string>('close-position', {
                    user_id: userId,
                    order_id: orderId,
                })
                .subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
        })
    }

    async queryOrder() {
        return new Promise<Order[]>((resolve, reject) => {
            this.client.send<Order[]>('query-order', { sub: '123' }).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            })
        })
    }

    @Cron('0 7 * * *', {
        timeZone: 'Asia/Bangkok',
    })
    async cronClosePosition() {
        try {
            const order = await this.queryOrder()
            order.map(async (o) => await this.closePosition({userId:o.user_id,orderId:o.id}))
            console.log("OKAY")
        } catch (error) {
            console.log(error)
        }
    }
}
