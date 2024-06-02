import { NestFactory } from '@nestjs/core';
import { SignalModule } from './signal.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SIGNAL_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SignalModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../signal.proto'),
      package: SIGNAL_PACKAGE_NAME,
      url: 'localhost:5007'
    }
  })
  await app.listen()
}
bootstrap()
