import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { Role as UserRole } from 'src/modules/users/schemas/users.schema'

export const ROLES_KEY_TOKEN = 'roles'

export const Role = (role: keyof typeof UserRole): CustomDecorator => {
    return SetMetadata(ROLES_KEY_TOKEN, role)
}
