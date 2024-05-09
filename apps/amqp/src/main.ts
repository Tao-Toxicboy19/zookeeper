import { NestFactory } from '@nestjs/core';
import { AmqpModule } from './amqp.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AmqpModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      queueOptions: {
        durable: true,
      },
    },
  })
  await app.listen()
}
bootstrap()