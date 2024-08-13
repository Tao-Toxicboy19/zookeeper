import { Logger, Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PositionModule } from './position/position.module'
import { KeyModule } from './key/key.module'
import { PredictModule } from './predict/predict.module'
import { NotificationModule } from './notification/notification.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/gateway/.env',
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 10,
            },
        ]),
        ElasticsearchModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                node: configService.get<string>('ELASTICSEARCH_NODE'), // ใช้ค่าจาก .env
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        OrdersModule,
        KeyModule,
        PositionModule,
        PredictModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
