import { CustomDecorator, SetMetadata } from '@nestjs/common'

export enum AuthType {
    jwt = 'jwt',
}

export const AUTH_DECORATOR_KEY = 'auth'

export const Auth = (authType: keyof typeof AuthType): CustomDecorator =>
    SetMetadata(AUTH_DECORATOR_KEY, authType)
