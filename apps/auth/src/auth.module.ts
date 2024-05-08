import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './entities/user. entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: 'zookeeper', // เปลี่ยนเป็นชื่อผู้ใช้ที่ถูกกำหนดในไฟล์ docker-compose.yml
      password: '123456', // เปลี่ยนเป็นรหัสผ่านที่ถูกกำหนดในไฟล์ docker-compose.yml
      database: 'zookeeper',
      synchronize: true,
      entities: [UserEntity],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
