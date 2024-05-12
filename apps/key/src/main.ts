import { NestFactory } from '@nestjs/core';
import { KeyModule } from './key.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { KEY_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(KeyModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../key.proto'),
      package: KEY_PACKAGE_NAME,
      url: 'localhost:5005'
    }
  })
  await app.listen()
}
bootstrap()
