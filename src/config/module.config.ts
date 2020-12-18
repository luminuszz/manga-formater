import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import { QueueOptions } from 'bull'
import envvar from './envvar'

export const configModule: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: '.env',
    load: [envvar],
}

export const bullModuleConfig: QueueOptions = {
    redis: {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
    },
}
