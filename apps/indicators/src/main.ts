import { NestFactory } from '@nestjs/core';
import { IndicatorsModule } from './indicators.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { INDICATOR_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IndicatorsModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../indicator.proto'),
      package: INDICATOR_PACKAGE_NAME,
      url: 'localhost:5006'
    }
  })
  await app.listen()
}
bootstrap()