import { NestFactory } from '@nestjs/core';
import { KeyModule } from './key.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { KEY_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(KeyModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(KeyModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../key.proto'),
      package: KEY_PACKAGE_NAME,
      url: configService.get<string>('GRPC_URL')
    }
  })
  await app.listen()
}
bootstrap()
