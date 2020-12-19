import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces'
import { MongooseModuleOptions } from '@nestjs/mongoose'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
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

export const eventEmitterConfig: EventEmitterModuleOptions = {
    maxListeners: 10,
    wildcard: false,
    delimiter: '.',
    removeListener: false,
    verboseMemoryLeak: false,
    ignoreErrors: false,
}

export const typeOrmModuleConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    useUnifiedTopology: true,
    database: 'mangafinder',
    entities: ['dist/**/schemas/*.schema.js'],
}
