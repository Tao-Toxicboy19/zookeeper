import { Module } from '@nestjs/common'
import { KEY_PACKAGE_NAME } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KeyController } from './key.controller'
import { KeyService } from './key.service'
import { SecretGuard } from './secret.guard'

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
    controllers: [KeyController],
    providers: [KeyService, SecretGuard],
    exports: [KeyService],
})
export class KeyModule {}
