import {
    BalanceResponse,
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeServiceClient,
    KeyResponse,
} from '@app/common'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { KeyService } from '../key/key.service'

@Injectable()
export class PositionService implements OnModuleInit {
    private exchangeServiceClient: ExchangeServiceClient

    constructor(
        private readonly keyService: KeyService,
        @Inject(EXCHANGE_PACKAGE_NAME) private client: ClientGrpc,
    ) {}

    async onModuleInit() {
        this.exchangeServiceClient =
            this.client.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
    }

    async getWallet(userId: string): Promise<BalanceResponse> {
        return new Promise<BalanceResponse>((resolve, reject) => {
            this.exchangeServiceClient.balance({ userId }).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err),
            })
        })
    }

    async getKey(userId: string): Promise<KeyResponse> {
        try {
            return await this.keyService.getKey({ userId })
        } catch (error) {
            throw error
        }
    }
}
