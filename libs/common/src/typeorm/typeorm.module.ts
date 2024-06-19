import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: '',
            autoLoadEntities: true,
            synchronize: true,
            entities:[('../entities/**.entity{.ts.js}')]
         })
    ]
})
export class TypeormModule { }
