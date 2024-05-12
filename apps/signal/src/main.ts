import { NestFactory } from '@nestjs/core';
import { SignalModule } from './signal.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SignalModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../indicator.proto'),
      package: '12',
      url: 'localhost:5007'
    }
  })
  await app.listen()
}
bootstrap()
