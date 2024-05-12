import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';
import { AUTH_PACKAGE_NAME, JwtStrategy, RefreshJwtStrategy } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
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
    ]),
    PassportModule,
  ],
  controllers: [AuthClientController],
  providers: [
    AuthClientService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthClientModule { }
