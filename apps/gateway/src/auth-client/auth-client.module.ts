import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';
import { AUTH_PACKAGE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { LocalStrategy } from './strategies/loca.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../auth.proto')
        }
      }
    ]),
    PassportModule,
  ],
  controllers: [AuthClientController],
  providers: [
    AuthClientService,
    LocalStrategy,
  ],
})
export class AuthClientModule { }
