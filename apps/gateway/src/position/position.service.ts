import {
    BalanceResponse,
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

    async handleWallet(userId: string): Promise<BalanceResponse> {
        try {
            return new Promise<BalanceResponse>((resolve, reject) => {
                this.exchangeServiceClient.balance({ userId }).subscribe({
                    next: (response) => resolve(response),
                    error: (err) => reject(err),
                })
            })
        } catch (error) {
            throw error
        }
    }
}
