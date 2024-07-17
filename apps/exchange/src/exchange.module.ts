import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KEY_PACKAGE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { KafkaProducerModule } from './producer/kafka-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/exchange/.env'
    }),
    ClientsModule.registerAsync([
      {
        name: KEY_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: KEY_PACKAGE_NAME,
            protoPath: join(__dirname, '../key.proto'),
            url: configService.get<string>('KEY_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // KafkaProducerModule,
  ],
  controllers: [ExchangeController],
  providers: [
    ExchangeService,
  ],
})
export class ExchangeModule { }
