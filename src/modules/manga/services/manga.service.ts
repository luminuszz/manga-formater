import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createMangaDTO } from '../dtos/createManga.dto'
import { MongoRepository } from 'typeorm'
import { Manga, Page, Chapter } from '../schemas/manga.schema'
import { ExtractCap } from 'src/modules/finder/services/finder.service'

@Injectable()
export class MangaService {
    constructor(
        @InjectRepository(Manga)
        private readonly mangaRepository: MongoRepository<Manga>
    ) {}

    public async createManga(data: ExtractCap): Promise<Manga> {
        const { pages, author, title, cap } = data

        const currentPages = pages.map(
            page => new Page(page.currentPage, page.img)
        )

        const chapters: Chapter[] = [
            { chapterNumber: cap, pages: currentPages },
        ]

        const newManga = this.mangaRepository.create({
            author,
            title,
            chapters,
        })

        await this.mangaRepository.save(newManga)

        return newManga
    }
}
