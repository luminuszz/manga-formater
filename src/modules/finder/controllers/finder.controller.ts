import { InjectQueue } from '@nestjs/bull'
import { Body, Controller, Post } from '@nestjs/common'
import { Queue } from 'bull'
import { QueueKeys } from '../queues'
import { URLFormatter } from '../pipes/url.pipe'
import { DataExtract } from 'src/shared/utils/extractorUrl'
import { PipeMangaFinderRequest } from '../queues/filter.queue'

@Controller('finder')
export class FinderController {
    constructor(
        @InjectQueue(QueueKeys.pipeMangaFinder)
        private readonly filterPipeQueue: Queue<PipeMangaFinderRequest>
    ) {}

    @Post()
    public async activeFinderRequest(
        @Body('paths', URLFormatter) data: DataExtract[]
    ): Promise<void> {
        data.map(({ cap, currentUrl, title }) =>
            this.filterPipeQueue.add({ cap, title, currentUrl })
        )
    }
}
