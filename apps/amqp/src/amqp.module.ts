import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { CoreModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      name: 'mongodb',
      type: 'mongodb',
      url: `mongodb://root:example@localhost:27017/zookeeper?authSource=admin`,
      synchronize: true,
      entities: [Users],
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logging: true
    }),
    TypeOrmModule.forFeature([Users], 'mongodb'),
  ],
  controllers: [],
  providers: [
    ConsumerService
  ],
})
export class AmqpModule { }
