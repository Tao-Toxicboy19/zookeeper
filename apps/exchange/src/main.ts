import { NestFactory } from '@nestjs/core';
import { ExchangeModule } from './exchange.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EXCHANGE_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ExchangeModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../exchange.proto'),
      package: EXCHANGE_PACKAGE_NAME,
      url: 'localhost:5003'
    }
  })
  await app.listen()
}
bootstrap()
