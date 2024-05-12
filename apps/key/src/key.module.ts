import { Module } from '@nestjs/common';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { PrismaService } from '@app/common';

@Module({
  imports: [],
  controllers: [KeyController],
  providers: [
    KeyService,
    PrismaService,
  ],
})
export class KeyModule { }
