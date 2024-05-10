import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';
import { AUTH_PACKAGE_NAME, MAIL_PACKAGE_NAME } from '@app/common';
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
          protoPath: join(__dirname, '../auth.proto'),
          url: 'localhost:5002'
        }
      },
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
    PassportModule,
  ],
  controllers: [AuthClientController],
  providers: [
    AuthClientService,
    LocalStrategy,
  ],
})
export class AuthClientModule { }
