import {
    KeyServiceClient,
    KEY_PACKAGE_NAME,
    KEY_SERVICE_NAME,
    CreateKeyDto,
    KeyUserId,
    KeyResponse
} from '@app/common'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class KeyService implements OnModuleInit {
    private keyServiceClient: KeyServiceClient

    constructor(
        @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    }

    async create(request: CreateKeyDto) {
        return new Promise<KeyResponse>((resolve, reject) => {
            this.keyServiceClient.createKey(request).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err)
            })
        })
    }

    async getKey(request: KeyUserId): Promise<KeyResponse> {
        return new Promise<KeyResponse>((resolve, reject) => {
            this.keyServiceClient.getKey(request).subscribe({
                next: (response) => resolve(response),
                error: (err) => reject(err)
            })
        })
    }

    async hello() {
        console.log('hello world')
    }
}
