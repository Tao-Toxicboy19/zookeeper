import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { ProducerModule } from './producer/producer.module'
import { DatabaseModule, RedisModule } from '@app/common'
import { UsersModule } from './users/users.module'
import { APP_FILTER } from '@nestjs/core'
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions'

@Module({
    imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/auth/.env',
        }),
        ProducerModule,
        RedisModule,
        UsersModule,
        DatabaseModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_FILTER,
            useClass: GrpcServerExceptionFilter,
        },
    ],
})
export class AuthModule {}
