import { Module } from '@nestjs/common';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Positions } from './entities/positions.entity';

@Module({
  imports: [
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
