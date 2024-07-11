import { Injectable, OnModuleInit } from '@nestjs/common'
import { Consumer, Kafka } from 'kafkajs'
import { PositionGateway } from './position.gateway'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PositionService implements OnModuleInit {
    private readonly kafkaInstance: Kafka
    private consumer: Consumer
    private readonly positionTopic: string = 'position-topic'
    private readonly positionGroup: string = 'position-group'
    private readonly positionClient: string = 'position-client'

    constructor(
        private readonly appGateway: PositionGateway,
        private readonly configService: ConfigService,
    ) {
        this.kafkaInstance = new Kafka({
            clientId: this.positionClient,
            brokers: [configService.get<string>('KAFKA_URL')],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        })

        this.consumer = this.kafkaInstance.consumer({ groupId: this.positionGroup })
    }

    async onModuleInit() {
        await this.connectConsumer()
    }

    async connectConsumer() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: this.positionTopic, fromBeginning: false })
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const msg = message.value.toString()
                console.log({
                    partition,
                    offset: message.offset,
                    value: msg,
                })
                this.appGateway.emitMessage(msg) // Forward message to WebSocket
            },
        })
    }
}
