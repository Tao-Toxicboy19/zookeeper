import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { ConsumerModule } from './consumer.module'

async function bootstrap() {
  const configApp = await NestFactory.create(ConsumerModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ConsumerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queueOptions: {
        durable: true,
      },
    },
  })
  await app.listen()
}
bootstrap()