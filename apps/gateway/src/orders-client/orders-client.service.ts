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
import {
    ClientGrpc,
    ClientKafka
} from '@nestjs/microservices'
import * as ccxt from 'ccxt'

@Injectable()
export class OrdersClientService implements OnModuleInit {
    private ordersServiceClient: OrdersServiceClient
    private exchange: ccxt.Exchange

    constructor(
        @Inject(ORDERS_PACKAGE_NAME) private client: ClientGrpc,
    ) { }

    async onModuleInit() {
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

    private async createExchange() {
        this.exchange = new ccxt.binance({
            apiKey: 'lTuNlO5EnfHPGiIIeY6vdQeNiPfQB16SyNIpIE8sCotKe9unmUq8u5qk7QbVCIOa',
            secret: 'gtXa9rva2MdnNEl0rzizie0MWIBfGY1J32hRUWyjNEIr6LoOMuUh1tHIuePgkkgB',
            'enableRateLimit': true,
            options: {
                defaultType: "future",
            },
        })
    }


    async position(): Promise<any> {
        try {
            await this.createExchange()
            // const position = await this.exchange.fetchPositions()
            // return position
            return 'OK'
        } catch (error) {

        }
    }
}
