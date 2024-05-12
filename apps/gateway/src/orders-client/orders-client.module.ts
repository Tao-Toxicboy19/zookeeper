import { Module } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { OrdersClientController } from './orders-client.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: ORDERS_PACKAGE_NAME,
          protoPath: join(__dirname, '../orders.proto'),
          url: 'localhost:5004'
        }
      },
    ]),
  ],
  controllers: [OrdersClientController],
  providers: [OrdersClientService],
})
export class OrdersClientModule { }
