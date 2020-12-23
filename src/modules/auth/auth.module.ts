import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { HashModuleProvider } from 'src/shared/providers/hash/hash.module'
import { UsersModule } from '../users/users.module'
import { jwtModuleConfig, passportModuleConfig } from 'src/config/module.config'
import { AuthService } from './services/auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './controllers/auth.controller'

@Module({
    imports: [
        HashModuleProvider,
        PassportModule.register(passportModuleConfig),
        JwtModule.register(jwtModuleConfig),
        UsersModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
