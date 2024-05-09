import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './producer/producer.module';
import { Users } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb://root:example@localhost:27017/zookeeper?authSource=admin`,
      synchronize: true,
      entities: [Users],
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logging: true
    }),
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProducerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
