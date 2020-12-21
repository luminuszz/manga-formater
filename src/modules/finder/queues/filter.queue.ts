import {
    InjectQueue,
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    OnQueueProgress,
    Process,
    Processor,
} from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bull'
import { MangaService } from 'src/modules/manga/services/manga.service'
import { ExtractCap, IRequest } from '../dtos/finderService'

import { QueueKeys } from './index'

export interface PipeMangaFinderRequest {
    title: string
    cap: number
    currentUrl: string
}

@Processor(QueueKeys.pipeMangaFinder)
@Injectable()
export class FinderFilePipe {
    constructor(
        @InjectQueue(QueueKeys.saveFile)
        private readonly saveFileQueue: Queue<ExtractCap>,
        @InjectQueue(QueueKeys.finderDownloader)
        private readonly finderFileQueue: Queue<IRequest>,

        private readonly mangaService: MangaService
    ) {}

    @Process()
    public async filterPipe(job: Job<PipeMangaFinderRequest>): Promise<void> {
        const { cap, title, currentUrl } = job.data

        const checkMangaExists = await this.mangaService.findOneMangaByName(
            title
        )

        if (checkMangaExists) {
            console.log('Manga existe na base de dados, procurando o capítulo')

            const findChapter = checkMangaExists.chapters.find(
                chapter => chapter.chapterNumber === cap
            )
            if (!findChapter) {
                console.log('capitulo fora da base fazendo busca')
                this.finderFileQueue.add({ url: currentUrl })

                return
            }
            const { author, title } = checkMangaExists

            const formattedChapter = findChapter.pages.map(page => ({
                currentPage: page.pageNumber,
                img: page.img,
            }))

            this.saveFileQueue.add({
                author,
                title,
                cap: findChapter.chapterNumber,
                pages: formattedChapter,
            })
            return
        }

        console.log('O mangá não foi achado, iniciando processo de busca')

        this.finderFileQueue.add({ url: currentUrl })
    }

    @OnQueueActive()
    private onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name}`)
    }

    @OnQueueProgress()
    private progress(job: Job, progress: number): void {
        console.log(`proceeding.... ${job.id}, number: ${progress}`)
    }

    @OnQueueFailed()
    private error(error: Error) {
        console.log('erro')
        console.log(error)
    }

    @OnQueueCompleted()
    private completed(job: Job) {
        console.log(
            `job ${job.id} da fila ${job.name} finalizado, processa finalizado...`
        )
    }
}
