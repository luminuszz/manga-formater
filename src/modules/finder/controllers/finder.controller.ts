import { InjectQueue } from '@nestjs/bull'
import { Body, Controller, Post } from '@nestjs/common'
import { Queue } from 'bull'
import { QueueKeys } from '../queues'
import { ConverterService } from '../services/converter.service'
import { ExtractCap, FinderService, IRequest } from '../services/finder.service'
import { URLFormatter } from '../pipes/url.pipe'
import { MangaService } from 'src/modules/manga/services/manga.service'

@Controller('finder')
export class FinderController {
    constructor(
        @InjectQueue(QueueKeys.finderDownloader)
        private readonly addFinderServiceQueue: Queue<IRequest>,
        private readonly service: FinderService,
        private converterService: ConverterService,
        private finderService: FinderService,
        private readonly mangaService: MangaService
    ) {}

    @Post()
    public async activeFinderRequest(
        @Body('paths', URLFormatter) paths: string[]
    ): Promise<void> {
        await this.converterService.execute({
            title: 'Arifureta-Shokugyou-de-Sekai-Saikyou',
            cap: 2,
        })

        // paths.map(item => this.addFinderServiceQueue.add({ url: item }))
    }
}
