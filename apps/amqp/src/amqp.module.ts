import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIL_PACKAGE_NAME, PrismaService, RedisModule } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/amqp/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: MAIL_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: MAIL_PACKAGE_NAME,
            protoPath: join(__dirname, '../mail.proto'),
            url: configService.get<string>('MAIL_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
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