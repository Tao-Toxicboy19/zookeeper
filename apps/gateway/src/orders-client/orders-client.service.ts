import {
    ORDERS_PACKAGE_NAME,
    ORDERS_SERVICE_NAME,
    OrderResponse,
    OrdersDto,
    OrdersServiceClient
} from '@app/common'
import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

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
            return await this.ordersServiceClient.createOrder(request).toPromise()
        } catch (error) {
            if (error.code === HttpStatus.NOT_FOUND) {
                throw new NotFoundException(error.message.split(':')[1].trim())
            } else if (error.code === HttpStatus.CONFLICT) {
                throw new ConflictException(error.message.split(':')[1].trim())
            } else if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new BadRequestException(error.message.split(':')[1].trim())
            } else {
                throw new InternalServerErrorException(error.message.split(':')[1].trim())
            }
        }
    }
}
