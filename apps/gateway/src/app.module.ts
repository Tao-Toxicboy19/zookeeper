import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthClientModule } from './auth-client/auth-client.module';
import { OrdersClientModule } from './orders-client/orders-client.module';
import { KeyClientModule } from './key-client/key-client.module';
import { ConfigModule } from '@nestjs/config';
import { CorsMiddleware } from './cors/cors.middleware';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthClientModule,
    OrdersClientModule,
    KeyClientModule,
    PositionModule,
  ],
  controllers: [],
  providers: [],
})
// export class AppModule { }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
