import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaProducerService {
    private readonly kafkaInstance: Kafka
    private producer: Producer
    private readonly positionTopic: string = 'position-topic'
    private readonly positionClient: string = 'position-client'

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.kafkaInstance = new Kafka({
            clientId: this.positionClient,
            brokers: [configService.get<string>('KAFKA_URL')],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        })

        this.producer = this.kafkaInstance.producer()
    }

    async publish(message: string): Promise<void> {
        await this.producer.connect()
        await this.producer.send({
            topic: this.positionTopic,
            messages: [{ value: message }],
        })
        console.log('Message published to Kafka:', message)  // เพิ่ม log เพื่อตรวจสอบการส่งข้อมูล
    }
}
