import { Module } from '@nestjs/common';
import { AuthClientModule } from './auth-client/auth-client.module';
import { OrdersClientModule } from './orders-client/orders-client.module';

@Module({
  imports: [
    AuthClientModule,
    OrdersClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
