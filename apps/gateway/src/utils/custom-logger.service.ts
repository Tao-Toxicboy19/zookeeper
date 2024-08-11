import { Injectable, LoggerService } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'

@Injectable()
export class CustomLoggerService implements LoggerService {
    private readonly client: Client

    constructor() {
        this.client = new Client({ node: 'http://localhost:9200' })
    }

    log(message: any, context?: string, extra?: any) {
        this.sendToElasticsearch('log', message, context, undefined, extra)
    }

    error(message: any, trace?: string, context?: string, extra?: any) {
        this.sendToElasticsearch('error', message, context, trace, extra)
    }

    warn(message: any, context?: string) {
        this.sendToElasticsearch('warn', message, context)
    }

    debug(message: any, context?: string) {
        this.sendToElasticsearch('debug', message, context)
    }

    verbose(message: any, context?: string) {
        this.sendToElasticsearch('verbose', message, context)
    }

    private async sendToElasticsearch(
        level: string,
        message: any,
        context?: string,
        trace?: string,
        extra?: any,
    ) {
        try {
            await this.client.index({
                index: 'zookeeper-logs',
                document: {
                    timestamp: new Date().toISOString(),
                    level,
                    service: context || 'unknown-service',
                    message,
                    ...extra,
                    error: {
                        name: extra?.error?.name || 'UnknownError',
                        message: extra?.error?.message || 'No error message',
                        stack: extra?.error?.stack || 'No stack trace',
                    },
                },
            })
        } catch (error) {
            console.error('Error sending log to Elasticsearch', error)
        }
    }
}
