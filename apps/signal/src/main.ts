import { NestFactory } from '@nestjs/core';
import { SignalModule } from './signal.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SIGNAL_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(SignalModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SignalModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../signal.proto'),
      package: SIGNAL_PACKAGE_NAME,
      // url: 'localhost:5007'
      url: configService.get<string>('GRPC_URL')
    }
  })
  await app.listen()
}
bootstrap()
