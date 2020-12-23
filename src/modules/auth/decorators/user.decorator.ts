import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/modules/users/schemas/users.schema'
import { payloadDTO } from '../dtos/payload.dto'

type Values = {
    req: { user: payloadDTO }
}

export const UserRequest = createParamDecorator(
    (value: keyof User, context: ExecutionContext) => {
        const { user } = context.switchToHttp().getRequest<Values>().req

        if (value) {
            return user[value]
        }

        return user
    }
)
