import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib"
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";

@Injectable()
export class ConsumerService implements OnModuleInit {
    private readonly channelWrapper: ChannelWrapper
    private readonly logger = new Logger(ConsumerService.name)

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Users, 'mongodb')
        private readonly userRepository: Repository<Users>,
    ) {
        const connection = amqp.connect([this.configService.get<string>('RABBIT_MQ_URL')])
        this.channelWrapper = connection.createChannel()
    }

    onModuleInit() {
        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
            return channel.consume('signup', async (msg: ConsumeMessage) => {
                await channel.assertQueue('signup', { durable: true })
                channel.prefetch(2)
                if (msg) {
                    const connect = JSON.parse(msg.content.toString())
                    this.logger.debug('Received message:', connect)
                    this.userRepository.save(connect)
                    channel.ack(msg)
                }
            })
        })
    }
}