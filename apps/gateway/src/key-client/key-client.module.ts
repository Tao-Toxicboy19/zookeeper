import { Module } from '@nestjs/common'
import { KEY_PACKAGE_NAME } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { KeyClientController } from './key-client.controller'
import { KeyClientService } from './key-client.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KEY_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: KEY_PACKAGE_NAME,
            protoPath: join(__dirname, '../key.proto'),
            url: configService.get<string>('KEY_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [KeyClientController],
  providers: [KeyClientService],
})
export class KeyClientModule { }
