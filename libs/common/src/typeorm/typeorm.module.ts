import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb://admin:password@localhost:27017/zookeeper?authSource=admin',
            entities: [('../entities/**.entity{.ts.js}')],
            synchronize: true,
            useNewUrlParser: true,
            logging: true,
        }),
    ]
})
export class TypeormModule { }
