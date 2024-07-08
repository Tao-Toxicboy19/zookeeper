import { NestFactory } from '@nestjs/core'
import { OrderQueueModule } from './order-queue.module'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const configApp = await NestFactory.create(OrderQueueModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderQueueModule, {
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
