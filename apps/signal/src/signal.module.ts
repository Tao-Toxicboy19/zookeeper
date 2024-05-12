import { Module } from '@nestjs/common';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';

@Module({
  imports: [],
  controllers: [SignalController],
  providers: [SignalService],
})
export class SignalModule {}
