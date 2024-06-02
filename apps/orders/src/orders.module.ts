import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXCHANGE_PACKAGE_NAME, INDICATOR_PACKAGE_NAME, PrismaService, SIGNAL_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
    }),
    ClientsModule.register([
      {
        name: EXCHANGE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: EXCHANGE_PACKAGE_NAME,
          protoPath: join(__dirname, '../exchange.proto'),
          url: 'localhost:5003'
        }
      },
      {
        name: INDICATOR_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: INDICATOR_PACKAGE_NAME,
          protoPath: join(__dirname, '../indicator.proto'),
          url: 'localhost:5006'
        }
      },
      {
        name: SIGNAL_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: SIGNAL_PACKAGE_NAME,
          protoPath: join(__dirname, '../signal.proto'),
          url: 'localhost:5007'
        }
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
  ],
})
export class OrdersModule { }
