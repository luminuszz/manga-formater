import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HashModuleProvider } from 'src/shared/providers/hash/hash.module'
import { JwtGuard } from '../auth/guards/Auth.guard'
import { RoleGuard } from '../auth/guards/role.guard'
import { UsersController } from './controllers/users.controller'
import { User } from './schemas/users.schema'
import { UserService } from './services/users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User]), HashModuleProvider],
    providers: [
        UserService,
        { provide: APP_GUARD, useClass: JwtGuard },
        { provide: APP_GUARD, useClass: RoleGuard },
    ],
    controllers: [UsersController],
    exports: [UserService],
})
export class UsersModule {}
