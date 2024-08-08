import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { ConfigModule } from '@nestjs/config'
import { PositionModule } from './position/position.module'
import { KeyModule } from './key/key.module'
import { PredictModule } from './predict/predict.module'
import { NotificationModule } from './notification/notification.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/gateway/.env',
        }),
        AuthModule,
        OrdersModule,
        KeyModule,
        PositionModule,
        PredictModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
