import { Module } from '@nestjs/common'
import { ConsumerService } from './consumer.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EXCHANGE_PACKAGE_NAME } from '@app/common'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/order-queue/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: EXCHANGE_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: EXCHANGE_PACKAGE_NAME,
            protoPath: join(__dirname, '../exchange.proto'),
            url: configService.get<string>('EXCHANGE_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
      // {
      //   name: 'NOTIFICATION_SERVICE',
      //   imports: [ConfigModule],
      //   useFactory: async (configService: ConfigService) => ({
      //     transport: Transport.RMQ,
      //     options: {
      //       urls: [configService.get<string>('RABBITMQ_URL')],
      //       queue: configService.get<string>('NOTIFY_QUEUE'),
      //       queueOptions: {
      //         durable: true,
      //       },
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
    ]),
  ],
  providers: [ConsumerService],
})
export class ConsumerModule { }
