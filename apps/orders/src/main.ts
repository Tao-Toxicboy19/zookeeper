import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDERS_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../orders.proto'),
      package: ORDERS_PACKAGE_NAME,
      url: 'localhost:5004'
    }
  })
  await app.listen()
}
bootstrap()
