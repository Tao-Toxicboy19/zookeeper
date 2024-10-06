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

    // @Cron('* 7 * * *', {
    @Cron('* 7 * * *', {
        timeZone: 'Asia/Bangkok',
    })
    async createPrddict(): Promise<void> {
        console.log(`Hello world Predict 11 โมง ${new Date()}`)
        return new Promise<void>((resolve, reject) => {
            this.predictServiceClient.predict({}).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            })
        })
    }

    async findPredict(): Promise<any> {
        const today = new Date()
        const timestamp = Math.floor(today.getTime() / 1000)
        return new Promise((resolve, reject) => {
            this.predictServiceClient
                .getData({ timeStamp: timestamp })
                .subscribe({
                    next: (response) => resolve(response),
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

    @Cron('* 7 * * *', {
        timeZone: 'Asia/Bangkok',
    })
    async update(): Promise<void> {
        console.log("Updating data...")
        return new Promise<void>((resolve, reject) => {
            this.predictServiceClient.update({}).subscribe({
                next: () => resolve(),
                error: (err) => reject(err),
            })
        })
    }
}
