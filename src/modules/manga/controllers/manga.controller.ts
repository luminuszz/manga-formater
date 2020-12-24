import { Controller, Get, Param } from '@nestjs/common'
import { Manga } from '../schemas/manga.schema'
import { MangaService } from '../services/manga.service'

@Controller('manga')
export class MangaController {
    constructor(private readonly mangaService: MangaService) {}

    @Get(':slug')
    public async findMangaBySlug(@Param('slug') slug: string): Promise<Manga> {
        const currentManga = await this.mangaService.getMangaBySlug(slug)

        return currentManga
    }
}
