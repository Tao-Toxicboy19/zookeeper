import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MAIL_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../mail.proto'),
      package: MAIL_PACKAGE_NAME,
      url: 'localhost:5001'
    }
  })
  await app.listen()
}
bootstrap()
