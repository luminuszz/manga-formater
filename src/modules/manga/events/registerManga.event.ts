import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { createMangaDTO } from '../dtos/createManga.dto'
import { MangaService } from '../services/manga.service'

export enum MangaEvent {
    mangaExtract = 'manga.extract',
}

@Injectable()
export class RegisterMangaEvent {
    constructor(private readonly mangaService: MangaService) {}

    @OnEvent(MangaEvent.mangaExtract, { async: true })
    public async executeMangaExtract(payload: createMangaDTO): Promise<void> {
        console.log(`-> event: ${MangaEvent.mangaExtract} summon `)

        const checkMangaExists = await this.mangaService.findOneMangaByName(
            payload.title
        )

        if (checkMangaExists) {
            const checkChapterExists = checkMangaExists.chapters.find(
                chapter => chapter.chapterNumber === payload.cap
            )

            if (!checkChapterExists) {
                await this.mangaService.addChapter(checkMangaExists.id, {
                    chapterNumber: payload.cap,
                    pages: payload.pages,
                })
            }

            return
        }

        await this.mangaService.createManga({
            ...payload,
        })
    }
}
