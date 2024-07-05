import { KeyServiceClient, KEY_PACKAGE_NAME, KEY_SERVICE_NAME, CreateKeyDto, KeyUserId } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class KeyClientService implements OnModuleInit {
    private keyServiceClient: KeyServiceClient

    constructor(
        @Inject(KEY_PACKAGE_NAME) private keyClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.keyServiceClient = this.keyClient.getService<KeyServiceClient>(KEY_SERVICE_NAME)
    }

    create(request: CreateKeyDto) {
        return this.keyServiceClient.createKey(request)
    }

    getKey(request: KeyUserId) {
        return this.keyServiceClient.getKey(request)
    }
}
