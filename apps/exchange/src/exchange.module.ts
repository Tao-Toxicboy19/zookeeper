import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { PrismaService } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/exchange/.env'
    }),
  ],
  controllers: [ExchangeController],
  providers: [
    ExchangeService,
    PrismaService,
  ],
})
export class ExchangeModule { }
