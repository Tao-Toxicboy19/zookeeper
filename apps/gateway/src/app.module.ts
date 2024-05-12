import { Module } from '@nestjs/common';
import { AuthClientModule } from './auth-client/auth-client.module';
import { OrdersClientModule } from './orders-client/orders-client.module';
import { KeyClientModule } from './key-client/key-client.module';

@Module({
  imports: [
    AuthClientModule,
    OrdersClientModule,
    KeyClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
