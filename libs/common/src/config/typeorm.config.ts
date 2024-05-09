import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm'

const mongodbConfig = (
    configService: ConfigService
): MongoConnectionOptions => {
    return {
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        username: 'zookeeper', // เปลี่ยนเป็นชื่อผู้ใช้ที่ถูกกำหนดในไฟล์ docker-compose.yml
        password: '123456', // เปลี่ยนเป็นรหัสผ่านที่ถูกกำหนดในไฟล์ docker-compose.yml
        database: 'zookeeper',
        synchronize: true,
        entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
        useUnifiedTopology: true,
        useNewUrlParser: true,
        logging: true
    }
}

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return mongodbConfig(configService)
    }
}