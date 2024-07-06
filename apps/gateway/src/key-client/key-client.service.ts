import {
    KeyServiceClient,
    KEY_PACKAGE_NAME,
    KEY_SERVICE_NAME,
    CreateKeyDto,
    KeyUserId
} from '@app/common'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class KeyClientService implements OnModuleInit {
    private keyServiceClient: KeyServiceClient

    constructor(
        @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    }

    async create(request: CreateKeyDto) {
        try {
            return await firstValueFrom(this.keyServiceClient.createKey(request))
        } catch (error) {
            throw error
        }
    }

    // async getKey(request: KeyUserId) {
    //     try {
    //         return await firstValueFrom(this.keyServiceClient.getKey(request))
    //     } catch (error) {
    //         throw error
    //     }
    // }
}
