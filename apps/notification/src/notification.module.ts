import { Module } from '@nestjs/common'
import { NotificationConsumer } from './notification.consumer'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NotificationService } from './notification.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AUTH_PACKAGE_NAME } from '@app/common'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/noti-order-queue/.env',
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          service: 'gmail',
          auth: {
            user: configService.get<string>('USERNAME_EMAIL'),
            pass: configService.get<string>('PASSWORD_EMAIL')
          }
        }
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../auth.proto'),
            url: configService.get<string>('AUTH_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [
    NotificationConsumer,
    NotificationService
  ],
})
export class NotificationModule { }
