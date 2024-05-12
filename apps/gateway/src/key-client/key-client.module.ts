import { Module } from '@nestjs/common';
import { KEY_PACKAGE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { KeyClientController } from './key-client.controller';
import { KeyClientService } from './key-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KEY_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: KEY_PACKAGE_NAME,
          protoPath: join(__dirname, '../key.proto'),
          url: 'localhost:5005'
        }
      },
    ]),
  ],
  controllers: [KeyClientController],
  providers: [KeyClientService],
})
export class KeyClientModule { }
