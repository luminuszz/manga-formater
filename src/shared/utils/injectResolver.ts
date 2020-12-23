import { Abstract, Provider, Type } from '@nestjs/common'

type AbstractType<T = unknown> = string | symbol | Type<T> | Abstract<T>

enum NodeEnv {
    development = 'development',
    production = 'production',
}

type state<T> = {
    development: Type<T>
    production: Type<T>
}

export function injectResolver(
    abstraction: AbstractType,
    { development, production }: state<unknown>
): Provider {
    const provide = abstraction

    switch (process.env.NODE_ENV) {
        case NodeEnv.development:
            return { provide, useClass: development }

        case NodeEnv.production:
            return {
                provide,
                useClass: production,
            }

        default:
            return { provide, useClass: development }
    }
}
