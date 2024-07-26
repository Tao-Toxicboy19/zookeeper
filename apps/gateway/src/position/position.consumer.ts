import {
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common'
import {
    Consumer,
    Kafka
} from 'kafkajs'
import { ConfigService } from '@nestjs/config'
import { PositionGateway } from './position.gateway'
import * as ccxt from 'ccxt'

@Injectable()
export class PositionConsumer implements OnModuleInit {
    private readonly logger: Logger = new Logger(PositionConsumer.name)
    private readonly kafkaInstance: Kafka
    private consumer: Consumer

    constructor(
        // private readonly positionGateway: PositionGateway,
        private readonly configService: ConfigService,
    ) {
        this.kafkaInstance = new Kafka({
            clientId: 'position-client',
            brokers: [
                configService.get<string>('KAFKA_URL'),
            ],
            connectionTimeout: 3000,
            authenticationTimeout: 1000,
            reauthenticationThreshold: 10000,
        })

        this.consumer = this.kafkaInstance.consumer({ groupId: 'position-group' })

        this.consumer.on('consumer.connect', () => {
            this.logger.debug('Connected to Kafka')
        })

        this.consumer.on('consumer.disconnect', (err) => {
            this.logger.debug('Disconnected from Kafka:', err)
        })
    }

    async onModuleInit() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'position-topic', fromBeginning: false })
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const msg: {
                    user_id: string
                    position: ccxt.Position[]
                } = JSON.parse(message.value.toString())
                console.log({
                    partition,
                    offset: message.offset,
                    value: msg,
                })
                // this.positionGateway.emitMessage(JSON.stringify(msg.position), msg.user_id)
            },
        })
    }
}