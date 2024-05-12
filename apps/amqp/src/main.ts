import { NestFactory } from '@nestjs/core';
import { AmqpModule } from './amqp.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(AmqpModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AmqpModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_MQ_URL')],
      queueOptions: {
        durable: true,
      },
    },
  })
  await app.listen()
}
bootstrap()