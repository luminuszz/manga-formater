import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
    bullModuleConfig,
    configModule,
    eventEmitterConfig,
    typeOrmModuleConfig,
} from './config/module.config'
import { FinderModule } from './modules/finder/finder.module'
import { MangaModule } from './modules/manga/manga.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        ConfigModule.forRoot(configModule),
        BullModule.forRoot(bullModuleConfig),
        TypeOrmModule.forRoot(typeOrmModuleConfig),
        EventEmitterModule.forRoot(eventEmitterConfig),
        MangaModule,
        FinderModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
