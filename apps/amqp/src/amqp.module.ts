import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIL_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/amqp/.env',
    }),
    ClientsModule.register([
      {
        name: MAIL_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: MAIL_PACKAGE_NAME,
          protoPath: join(__dirname, '../mail.proto'),
          url: 'localhost:5001'
        }
      },
    ]),
    RedisModule,
  ],
  controllers: [],
  providers: [
    ConsumerService,
    PrismaService,
  ],
})
export class AmqpModule { }