import {
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeServiceClient,
} from '@app/common'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class PositionService implements OnModuleInit {
    private exchangeServiceClient: ExchangeServiceClient

    constructor(@Inject(EXCHANGE_PACKAGE_NAME) private client: ClientGrpc) {}

    async onModuleInit() {
        this.exchangeServiceClient =
            this.client.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
    }

    async sendUserId(userId: string): Promise<void> {
        new Promise<void>((resolve, reject) => {
            this.exchangeServiceClient.sendUserId({ userId }).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            })
        })
    }
}
