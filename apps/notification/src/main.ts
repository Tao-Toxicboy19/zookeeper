import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotificationModule } from './notification.module'

async function bootstrap() {
  const configApp = await NestFactory.create(NotificationModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: configService.get<string>('NOTIFY_QUEUE'),
      queueOptions: {
        durable: true
      },
    },
  });
  await app.listen();
  console.log('Microservice is listening...')
}
bootstrap()
