import { AuthType, AUTH_DECORATOR_KEY } from './auth.decorator'
import { Role } from 'src/modules/users/schemas/users.schema'
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ROLES_KEY_TOKEN } from '../decorators/role.decorator'
import { JwtGuard } from '../guards/Auth.guard'
import { RoleGuard } from '../guards/role.guard'

export const AuthFlow = (
    authType?: keyof typeof AuthType,
    role?: keyof typeof Role
): any =>
    applyDecorators(
        SetMetadata(AUTH_DECORATOR_KEY, authType),
        UseGuards(JwtGuard),
        SetMetadata(ROLES_KEY_TOKEN, role),
        UseGuards(RoleGuard)
    )
