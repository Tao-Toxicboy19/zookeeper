import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
    private readonly client: Redis

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new Redis({
            host: configService.get<string>('REDIS_URL'),
            port: Number(configService.get<string>('REDIS_PORT')),
            retryStrategy: (times) => Math.min(times * 50, 2000),
        })
    }

    async setKey(key: string, expire: number, value: string): Promise<void> {
        await this.client.setex(key, expire, value)
    }

    async getValue(key: string): Promise<string> {
        return await this.client.get(key)
    }

    async deleteKey(key: string): Promise<number> {
        return await this.client.del(key)
    }
}
