import { Module } from '@nestjs/common';
import { OrdersClientService } from './orders-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { OrdersClientController } from './orders-client.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDERS_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: ORDERS_PACKAGE_NAME,
            protoPath: join(__dirname, '../orders.proto'),
            url: configService.get<string>('ORDERS_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersClientController],
  providers: [OrdersClientService],
})
export class OrdersClientModule { }
