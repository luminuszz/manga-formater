import { Body, Controller, Post } from '@nestjs/common'
import { validUserDTO } from '../dtos/validUser.dto'
import { AuthService, LoginReturn } from '../services/auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    public async login(@Body() values: validUserDTO): Promise<LoginReturn> {
        const response = await this.authService.login(values)

        return response
    }
}
