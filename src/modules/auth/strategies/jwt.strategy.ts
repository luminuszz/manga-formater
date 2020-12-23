import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { payloadDTO } from 'src/modules/auth/dtos/payload.dto'
import { UserService } from 'src/modules/users/services/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.secret,
        })
    }

    public async validate(payload: payloadDTO): Promise<payloadDTO> {
        const validUSer = await this.usersService.findeOneUser({
            column: 'email',
            value: payload.email,
        })

        if (!validUSer) {
            throw new UnauthorizedException('user not authorized')
        }

        const { email, id, name, role } = validUSer

        return {
            email,
            id,
            role,
            name,
        }
    }
}
