import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RegisterMangaEvent } from './events/registerManga.event'
import { Manga } from './schemas/manga.schema'
import { MangaService } from './services/manga.service'

@Module({
    imports: [TypeOrmModule.forFeature([Manga])],
    providers: [MangaService, RegisterMangaEvent],
    exports: [RegisterMangaEvent, MangaService],
})
export class MangaModule {}
