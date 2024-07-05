import { Module } from '@nestjs/common'
import { AuthClientModule } from './auth-client/auth-client.module'
import { OrdersClientModule } from './orders-client/orders-client.module'
import { KeyClientModule } from './key-client/key-client.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthClientModule,
    OrdersClientModule,
    KeyClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
