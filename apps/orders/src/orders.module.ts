import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EXCHANGE_PACKAGE_NAME, PrismaService, SIGNAL_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
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
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
  ],
})
export class OrdersModule { }
