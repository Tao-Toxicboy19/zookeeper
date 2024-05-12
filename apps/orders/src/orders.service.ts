import { OrdersDto } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  onModuleInit() { }

  async create(dto: OrdersDto) {
    // await this.prisma.test_db.create({
    //   data: {
    //     name: 'test'
    //   }
    // })
    console.log(dto)
  }
}
