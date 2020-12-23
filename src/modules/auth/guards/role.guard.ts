import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY_TOKEN } from '../decorators/role.decorator'

import { UserService } from 'src/modules/users/services/users.service'
import { Role as UserRole } from 'src/modules/users/schemas/users.schema'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly usersService: UserService
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const currentRole = this.reflector.get<string>(
            ROLES_KEY_TOKEN,
            context.getHandler()
        )

        if (!currentRole) return true

        const user = context.switchToHttp().getRequest().user

        const foundedUser = await this.usersService.findeOneUser({
            column: 'email',
            value: user.email,
        })

        if (foundedUser.role !== UserRole[currentRole]) {
            throw new UnauthorizedException('user not authorized')
        }

        return true
    }
}
