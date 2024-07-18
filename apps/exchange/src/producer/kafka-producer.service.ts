import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaProducerService {
    private readonly logger = new Logger(KafkaProducerService.name)
    private readonly kafkaInstance: Kafka
    private producer: Producer

    constructor(
        private readonly configService: ConfigService
    ) {
        this.kafkaInstance = new Kafka({
            clientId: 'position-client',
            brokers: [
                configService.get<string>('KAFKA_URL')
            ],
        })

        this.producer = this.kafkaInstance.producer()

        this.producer.on('producer.connect', () => {
            this.logger.debug('Connected to Kafka')
        })

        this.producer.on('producer.disconnect', (err) => {
            this.logger.debug('Disconnected from Kafka:', err)
        })
    }

    async publish(message: string): Promise<void> {
        try {
            await this.producer.connect()
            await this.producer.send({
                topic: 'position-topic',
                messages: [{ value: message }],
            })

            this.logger.debug('Message sent to Kafka')
        } catch (error) {
            this.logger.error('Failed to send message to Kafka', error)
        } finally {
            await this.producer.disconnect()
            this.logger.debug('Producer disconnected from Kafka')
        }
    }
}
