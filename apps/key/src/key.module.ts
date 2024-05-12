import { Module } from '@nestjs/common';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { EXCHANGE_PACKAGE_NAME, PrismaService } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EXCHANGE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: EXCHANGE_PACKAGE_NAME,
          protoPath: join(__dirname, '../exchange.proto'),
          url: 'localhost:5003'
        }
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
