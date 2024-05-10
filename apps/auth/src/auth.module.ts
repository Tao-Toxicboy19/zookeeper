import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './producer/producer.module';
import { RedisModule } from 'apps/amqp/src/redis/redis.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
