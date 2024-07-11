import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule)
  let configService = configApp.get(ConfigService)

  const app = await NestFactory.create(AppModule)

  // Enable CORS for all origins, methods, and headers
  app.enableCors({
    allowedHeaders: ['Content-Type', '*'],
    origin: [configService.get<string>('CLIEN_URL')],
    credentials: true,
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  await app.listen(configService.get<string>('PORT'))
}
bootstrap()
