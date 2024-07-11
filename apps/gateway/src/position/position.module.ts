import { Module } from '@nestjs/common'
import { PositionGateway } from './position.gateway'
import { PositionService } from './position.service'

@Module({
  imports: [],
  providers: [
    PositionGateway,
    PositionService
  ],
})
export class PositionModule { }
