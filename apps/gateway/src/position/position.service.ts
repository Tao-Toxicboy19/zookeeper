import { Injectable, OnModuleInit } from '@nestjs/common'
import { Consumer, Kafka } from 'kafkajs'
import { PositionGateway } from './position.gateway'

@Injectable()
export class PositionService implements OnModuleInit {
    private readonly kafkaInstance: Kafka
    private consumer: Consumer

    constructor(private readonly appGateway: PositionGateway) {
        this.kafkaInstance = new Kafka({
            clientId: 'position-client',
            brokers: ['localhost:9092'],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        })

        this.consumer = this.kafkaInstance.consumer({ groupId: 'position-group' })
    }

    async onModuleInit() {
        await this.connectConsumer()
    }

    async connectConsumer() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'position-topic', fromBeginning: false })
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
