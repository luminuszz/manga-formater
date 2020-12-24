import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository, ObjectID } from 'typeorm'
import { Manga, Chapter, Page } from '../schemas/manga.schema'
import { Chapter as ChapterRequest } from '../dtos/createManga.dto'
import { ExtractCap } from 'src/modules/finder/dtos/finderService'

interface MangaReturn {
    mangas: Manga[]
    totalOfMangas: number
}

@Injectable()
export class MangaService {
    constructor(
        @InjectRepository(Manga)
        private readonly mangaRepository: MongoRepository<Manga>
    ) {}

    public async createManga(data: ExtractCap): Promise<Manga> {
        const { cap, pages } = data

        const formatterPages = pages.map(
            item => ({ img: item.img, pageNumber: item.currentPage } as Page)
        )

        const chapter = new Chapter(cap, formatterPages)

        const newManga = new Manga()

        newManga.author = data.author
        newManga.title = data.title
        newManga.posterImage = data.posterImage
        newManga.slug = data.title.replace(/\s/g, '-')
        newManga.chapters = [chapter]

        await this.mangaRepository.save(newManga)

        return newManga
    }

    public async findOneMangaByName(token: string): Promise<Manga> {
        const currentManga = await this.mangaRepository.findOne({
            title: token,
        })

        return currentManga
    }

    public async addChapter(
        mangaId: ObjectID,
        chapter: ChapterRequest
    ): Promise<Manga> {
        const currentManga = await this.mangaRepository.findOne(mangaId)

        const formatterPages = chapter.pages.map(
            item => ({ img: item.img, pageNumber: item.currentPage } as Page)
        )

        const newChapter = new Chapter(chapter.chapterNumber, formatterPages)

        currentManga.chapters = [...currentManga.chapters, newChapter]

        await this.mangaRepository.save(currentManga)

        return currentManga
    }

    public async getMangas(): Promise<MangaReturn> {
        const [
            mangas,
            totalOfMangas,
        ] = await this.mangaRepository.findAndCount()

        return {
            mangas,
            totalOfMangas,
        }
    }

    public async getMangaBySlug(slug: string): Promise<Manga> {
        const currentManga = await this.mangaRepository.findOne({
            where: { slug },
        })

        return currentManga
    }
}
