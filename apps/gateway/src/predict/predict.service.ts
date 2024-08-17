import {
    PREDICT_PACKAGE_NAME,
    PREDICT_SERVICE_NAME,
    PredictServiceClient,
} from '@app/common'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class PredictService implements OnModuleInit {
    private predictServiceClient: PredictServiceClient

    constructor(@Inject(PREDICT_PACKAGE_NAME) private client: ClientGrpc) {}

    async onModuleInit() {
        this.predictServiceClient =
            this.client.getService<PredictServiceClient>(PREDICT_SERVICE_NAME)
    }

    async debug() {
        this.predictServiceClient.predict({})
    }

    // @Cron('0 */5 * * * *', {
    //     timeZone: 'Asia/Bangkok',
    // })
    async createPrddict(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.predictServiceClient.predict({}).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            })
        })
    }

    async deleteData(): Promise<void> {
        const today = new Date()
        const timestamp = Math.floor(today.getTime() / 1000)
        return new Promise<void>((resolve, reject) => {
            this.predictServiceClient
                .deleteall({ timeStamp: timestamp })
                .subscribe({
                    next: () => resolve(),
                    error: (err) => reject(err),
                })
        })
    }
}
