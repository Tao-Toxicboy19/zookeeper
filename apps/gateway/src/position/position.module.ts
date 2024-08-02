import { Module } from '@nestjs/common'
import { PositionGateway } from './position.gateway'
import { PositionConsumer } from './position.consumer'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EXCHANGE_PACKAGE_NAME } from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import { PositionService } from './position.service'
import { KeyModule } from '../key/key.module'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EXCHANGE_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: EXCHANGE_PACKAGE_NAME,
            protoPath: join(__dirname, '../exchange.proto'),
            url: configService.get<string>('EXCHANGE_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KeyModule
  ],
  providers: [
    PositionGateway,
    PositionConsumer,
    PositionService,
  ],
})
export class PositionModule { }
