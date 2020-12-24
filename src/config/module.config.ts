import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces'
import { JwtModuleOptions } from '@nestjs/jwt'
import { IAuthModuleOptions } from '@nestjs/passport'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { QueueOptions } from 'bull'
import { jwtConfig } from './jwt.config'
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

export const typeOrmModuleConfig: TypeOrmModuleOptions =
    process.env.NODE_ENV === 'development'
        ? {
              type: 'mongodb',
              host: 'localhost',
              port: 27017,
              useUnifiedTopology: true,
              database: 'mangafinder',
              entities: ['dist/**/schemas/*.schema.js'],
          }
        : {
              type: 'mongodb',
              useUnifiedTopology: true,
              url: process.env.MONGO_URL,
              entities: ['dist/**/schemas/*.schema.js'],
          }

export const jwtModuleConfig: JwtModuleOptions = {
    secret: jwtConfig.secret,
    signOptions: {
        expiresIn: jwtConfig.expireIn,
    },
}
export const passportModuleConfig: IAuthModuleOptions = {
    defaultStrategy: 'jwt',
}
