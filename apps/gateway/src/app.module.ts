import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { ConfigModule } from '@nestjs/config'
import { PositionModule } from './position/position.module'
import { KeyModule } from './key/key.module'
import { PredictModule } from './predict/predict.module'
import { NotificationModule } from './notification/notification.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/gateway/.env',
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000, // ระยะเวลาในการนับ request ในวินาที
                limit: 10, // จำนวน request สูงสุดที่อนุญาตในช่วงเวลาที่กำหนด
            },
        ]),
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
