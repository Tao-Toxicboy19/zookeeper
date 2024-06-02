import { Module } from '@nestjs/common';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INDICATOR_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INDICATOR_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: INDICATOR_PACKAGE_NAME,
          protoPath: join(__dirname, '../indicator.proto'),
          url: 'localhost:5006'
        }
      },
    ])
  ],
  controllers: [SignalController],
  providers: [SignalService],
})
export class SignalModule { }
