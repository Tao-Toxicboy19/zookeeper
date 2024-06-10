import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDERS_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(OrdersModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../orders.proto'),
      package: ORDERS_PACKAGE_NAME,
      // url: 'localhost:5004'
      url: configService.get<string>('GRPC_URL')
    }
  })
  await app.listen()
}
bootstrap()
