import { Module } from '@nestjs/common'
import { PredictService } from './predict.service'
import { PredictController } from './predict.controller'
import { PREDICT_PACKAGE_NAME } from '@app/common/types/predict/predict'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PREDICT_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PREDICT_PACKAGE_NAME,
            protoPath: join(__dirname, '../predict.proto'),
            url: configService.get<string>('PREDICT_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PredictController],
  providers: [PredictService],
})
export class PredictModule { }
