import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionGateway } from './position.gateway';

@Module({
  providers: [
    PositionGateway,
    PositionService
  ],
})
export class PositionModule { }
