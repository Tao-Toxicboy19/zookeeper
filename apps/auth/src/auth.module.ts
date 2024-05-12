import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './producer/producer.module';
import { PrismaService, RedisModule } from '@app/common';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    ProducerModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
  ],
})
export class AuthModule { }
