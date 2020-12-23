import { Body, Controller, Post } from '@nestjs/common'
import { AuthFlow } from 'src/modules/auth/decorators/authFlow.decorator'
import { createUserDTO } from '../dtos/createUser.dto'
import { User } from '../schemas/users.schema'
import { UserService } from '../services/users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @AuthFlow('jwt', 'admin')
    @Post()
    public async createUser(@Body() data: createUserDTO): Promise<User> {
        const newUSer = await this.usersService.createUser(data)

        return newUSer
    }

    @AuthFlow('jwt', 'admin')
    @Post('admin')
    public async createAdminUserUser(
        @Body() data: createUserDTO
    ): Promise<User> {
        const newUSer = await this.usersService.createAdminUser(data)

        return newUSer
    }
}
