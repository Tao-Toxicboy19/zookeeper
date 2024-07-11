import {
    EXCHANGE_PACKAGE_NAME,
    EXCHANGE_SERVICE_NAME,
    ExchangeServiceClient,
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
    private exchangeServiceClient: ExchangeServiceClient

    constructor(
        @Inject(ORDERS_PACKAGE_NAME) private client: ClientGrpc,
        @Inject(EXCHANGE_PACKAGE_NAME) private clientEx: ClientGrpc,
    ) { }

    async onModuleInit() {
        this.ordersServiceClient = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME)
        this.exchangeServiceClient = this.clientEx.getService<ExchangeServiceClient>(EXCHANGE_SERVICE_NAME)
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

    async position(): Promise<any> {
        try {
            await this.exchangeServiceClient.createLimitBuy({
                id: '123',
                symbol: '123',
                leverage: 10,
                quantity: 10,
                userId: '123',
                position: '123'
            }).toPromise()
            // await this.createExchange()
            // const position = await this.exchange.fetchPositions()
            // return position
            return 'OK'
        } catch (error) {

        }
    }
}
