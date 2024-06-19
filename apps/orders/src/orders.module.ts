import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule, EXCHANGE_PACKAGE_NAME, PrismaService, SIGNAL_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './schemas/order.schema';
import { OrdersRepository } from './order.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: EXCHANGE_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: EXCHANGE_PACKAGE_NAME,
            protoPath: join(__dirname, '../exchange.proto'),
            url: configService.get<string>('EXCHANGE_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SIGNAL_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SIGNAL_PACKAGE_NAME,
            protoPath: join(__dirname, '../signal.proto'),
            url: configService.get<string>('SIGNAL_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature([{ name: Orders.name, schema: OrderSchema }]),
    DatabaseModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    PrismaService,
  ],
})
export class OrdersModule { }
