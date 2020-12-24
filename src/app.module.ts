import { BullModule } from '@nestjs/bull'
import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
    bullModuleConfig,
    configModule,
    eventEmitterConfig,
    typeOrmModuleConfig,
} from './config/module.config'
import { FinderModule } from './modules/finder/finder.module'
import { MangaModule } from './modules/manga/manga.module'
import { UsersModule } from './modules/users/users.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ClassValidatorPipe } from './shared/pipes/classValidator.pipe'
import { AuthModule } from './modules/auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot(configModule),
        BullModule.forRoot(bullModuleConfig),
        TypeOrmModule.forRoot(typeOrmModuleConfig),
        EventEmitterModule.forRoot(eventEmitterConfig),
        ScheduleModule.forRoot(),
        MangaModule,
        FinderModule,
        UsersModule,
        AuthModule,
    ],

    providers: [
        { provide: APP_PIPE, useClass: ClassValidatorPipe },

        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
    controllers: [],
})
export class AppModule {}
