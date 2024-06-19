import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { RedisModule } from '@app/common';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/amqp/.env',
    }),
    RedisModule,
    MailModule
  ],
  controllers: [],
  providers: [
    ConsumerService,
  ],
})
export class AmqpModule { }