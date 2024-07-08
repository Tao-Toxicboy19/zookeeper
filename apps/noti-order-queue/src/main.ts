import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotiOrderQueueModule } from './noti-order-queue.module'

async function bootstrap() {
  const configApp = await NestFactory.create(NotiOrderQueueModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotiOrderQueueModule, {
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
