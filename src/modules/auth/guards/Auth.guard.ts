import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { AuthType, AUTH_DECORATOR_KEY } from '../decorators/auth.decorator'

type canActiveReturn = boolean | Promise<boolean> | Observable<boolean>

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    public canActivate(context: ExecutionContext): canActiveReturn {
        const authType = this.reflector.get<string>(
            AUTH_DECORATOR_KEY,
            context.getHandler()
        )

        if (!AuthType[authType]) {
            return true
        }

        return super.canActivate(context)
    }
}
