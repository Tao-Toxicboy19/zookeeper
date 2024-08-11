import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common'

@Catch(HttpException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        if (exception.getStatus() === 429) {
            response.status(429).json({
                statusCode: 429,
                message: 'Too Many Requests - Custom Message',
            })
        } else {
            response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.message,
            })
        }
    }
}
