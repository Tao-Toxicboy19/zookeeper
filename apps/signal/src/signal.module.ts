import { Module } from '@nestjs/common';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Positions } from './entities/positions.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/signal/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './app.sqlite',
      entities: [Positions],
      synchronize: process.env.NODE_ENV != 'production',
    }),
    TypeOrmModule.forFeature([Positions]),
  ],
  controllers: [SignalController],
  providers: [SignalService],
})
export class SignalModule { }
