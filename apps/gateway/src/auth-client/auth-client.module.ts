import { Module } from '@nestjs/common'
import { AuthClientService } from './auth-client.service'
import { AuthClientController } from './auth-client.controller'
import { AUTH_PACKAGE_NAME, JwtStrategy, RefreshJwtStrategy } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { join } from 'path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../auth.proto'),
            url: configService.get<string>('AUTH_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
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
