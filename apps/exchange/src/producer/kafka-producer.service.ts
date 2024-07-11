import { Injectable } from '@nestjs/common'
import { Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaProducerService {
    private readonly kafkaInstance: Kafka
    private producer: Producer

    constructor() {
        this.kafkaInstance = new Kafka({
            clientId: 'position-client',
            brokers: ['localhost:9092'],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        })

        this.producer = this.kafkaInstance.producer()
    }

    async publish(message: any): Promise<void> {
        await this.producer.connect()
        await this.producer.send({
            topic: 'position-topic',
            messages: [{ value: JSON.stringify(message) }],
        })
        console.log('Message published to Kafka:', message)  // เพิ่ม log เพื่อตรวจสอบการส่งข้อมูล
    }
}
