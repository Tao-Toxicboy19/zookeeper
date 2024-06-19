import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schemas';
import { UsersRepository } from './user.repository';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProducerModule,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule { }
