import { Module } from '@nestjs/common'
import { ConsumerService } from './consumer.service'

@Module({
  providers: [ConsumerService],
  exports: [ConsumerService],  // เพิ่ม export service ถ้าจำเป็น
})
export class ConsumerModule { }
