import { Module } from '@nestjs/common';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { DatabaseModule, EXCHANGE_PACKAGE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeysRepository } from './key.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { KeySchema, Keys } from './schemas/key.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
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
    MongooseModule.forFeature([{ name: Keys.name, schema: KeySchema }]),
    DatabaseModule,
  ],
  controllers: [KeyController],
  providers: [
    KeyService,
    KeysRepository,
  ],
})
export class KeyModule { }
