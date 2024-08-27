import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerExceptionFilter } from './utils/throttler-exception.filter'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config() // Load environment variables from .env file
async function bootstrap() {
    const configApp = await NestFactory.create(AppModule)
    let configService = configApp.get(ConfigService)

    const app = await NestFactory.create(AppModule)

    app.enableCors({
        allowedHeaders: ['Content-Type', '*'],
        // origin: [configService.get<string>('CLIENT_URL')],
        origin: true,
        credentials: true,
    })
    app.useGlobalFilters(new ThrottlerExceptionFilter())
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser())
    await app.listen(configService.get<string>('PORT') || 3000)
    console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
