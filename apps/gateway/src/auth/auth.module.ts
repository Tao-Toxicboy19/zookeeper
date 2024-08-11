import { Logger, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import {
    JwtStrategy,
    AUTH_PACKAGE_NAME,
    RefreshJwtStrategy,
    GoogleStrategy,
} from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { join } from 'path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies'
import { APP_FILTER } from '@nestjs/core'
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions'
import { CustomLoggerService } from '../utils/custom-logger.service'

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
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        RefreshJwtStrategy,
        GoogleStrategy,
        {
            provide: APP_FILTER,
            useClass: GrpcServerExceptionFilter,
        },
        {
            provide: Logger,
            useClass: CustomLoggerService,
        },
    ],
})
export class AuthModule {}
