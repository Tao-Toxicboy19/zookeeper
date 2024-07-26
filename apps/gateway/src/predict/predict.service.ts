
import {
    PREDICT_PACKAGE_NAME,
    PREDICT_SERVICE_NAME,
    PredictServiceClient
} from '@app/common'
import {
    Inject,
    Injectable,
    OnModuleInit
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class PredictService implements OnModuleInit {
    private predictServiceClient: PredictServiceClient

    constructor(
        @Inject(PREDICT_PACKAGE_NAME) private client: ClientGrpc,
    ) { }

    async onModuleInit() {
        this.predictServiceClient = this.client.getService<PredictServiceClient>(PREDICT_SERVICE_NAME)
    }

    async debug() {
        this.predictServiceClient.predict({})
    }

}
