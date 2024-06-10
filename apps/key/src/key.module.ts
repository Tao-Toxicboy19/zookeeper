import { Module } from '@nestjs/common';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { EXCHANGE_PACKAGE_NAME, PrismaService } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/key/.env',
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
    ]),
  ],
  controllers: [KeyController],
  providers: [
    KeyService,
    PrismaService,
  ],
})
export class KeyModule { }
