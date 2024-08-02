import { Module } from '@nestjs/common'
import { RedisModule } from '@app/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConsumerService } from './consumer.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/mail-queue/.env',
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
    RedisModule,
  ],
  providers: [
    ConsumerService,
  ],
})
export class ConsumerModule { }
