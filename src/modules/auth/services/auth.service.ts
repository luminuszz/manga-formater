import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validUserDTO } from 'src/modules/auth/dtos/validUser.dto'
import { User } from 'src/modules/users/schemas/users.schema'
import { UserService } from 'src/modules/users/services/users.service'
import { HashService } from 'src/shared/providers/hash/hash.service'

export interface LoginReturn {
    token: string
    user: User
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService
    ) {}

    public async validUser({ email, password }: validUserDTO): Promise<User> {
        const foundUser = await this.usersService.findeOneUser({
            column: 'email',
            value: email,
        })

        if (!foundUser) return null

        const validPassword = await this.hashService.validateHash(
            password,
            foundUser.password
        )

        if (!validPassword) return null

        return foundUser
    }

    public async createToken({
        email,
        id,
        role,
    }: User): Promise<{ token: string }> {
        const payload = { email, id, role }

        const token = await this.jwtService.signAsync(payload)

        return {
            token,
        }
    }

    public async login({
        email,
        password,
    }: validUserDTO): Promise<LoginReturn> {
        const validUSer = await this.validUser({ email, password })

        if (!validUSer) {
            throw new UnauthorizedException('Credentials does not match')
        }

        const { token } = await this.createToken(validUSer)

        delete validUSer.password

        return {
            token,
            user: validUSer,
        }
    }
}
