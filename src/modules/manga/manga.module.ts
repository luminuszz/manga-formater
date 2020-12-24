import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MangaController } from './controllers/manga.controller'
import { RegisterMangaEvent } from './events/registerManga.event'
import { Manga } from './schemas/manga.schema'
import { MangaService } from './services/manga.service'

@Module({
    imports: [TypeOrmModule.forFeature([Manga])],
    providers: [MangaService, RegisterMangaEvent],
    exports: [MangaService, RegisterMangaEvent],
    controllers: [MangaController],
})
export class MangaModule {}
