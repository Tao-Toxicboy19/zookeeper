import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/mail/.env',
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
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
