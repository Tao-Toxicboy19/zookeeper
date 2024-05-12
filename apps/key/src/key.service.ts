import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateKeyDto, KeyResponse, PrismaService } from '@app/common';
import { randomUUID } from 'crypto';

@Injectable()
export class KeyService implements OnModuleInit {
  private readonly logger = new Logger(KeyService.name)

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  onModuleInit() { }

  async create(dto: CreateKeyDto): Promise<KeyResponse> {
    try {
      const existing = await this.prisma.keys.findUnique({ where: { userId: dto.userId } })
      if (existing) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Keys already exist for this user'
        }
      }

      await this.prisma.keys.create({
        data: {
          id: randomUUID(),
          userId: dto.userId,
          apiKey: dto.apiKey,
          secretKey: dto.secretKey,
          updatedAt: new Date()
        }
      })

      return {}
    } catch (error) {
      throw error
    }
  }

}
