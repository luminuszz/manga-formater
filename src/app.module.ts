import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { bullModuleConfig, configModule } from './config/module.config'
import { FinderModule } from './modules/finder/finder.module'
import { MangaModule } from './modules/manga/manga.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModule),
        BullModule.forRoot(bullModuleConfig),
        FinderModule,
        MangaModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
