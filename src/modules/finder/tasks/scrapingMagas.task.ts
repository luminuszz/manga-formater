import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { IRequest } from 'src/modules/finder/dtos/finderService'
import { QueueKeys } from 'src/modules/finder/queues'
import { ScrappingService } from '../services/sracpping.service'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class ScrappingMangasTask {
    constructor(
        @InjectQueue(QueueKeys.finderDownloader)
        private readonly finderDownloaderQueue: Queue<IRequest>,
        private readonly scrapingService: ScrappingService
    ) {}

    // @Cron(CronExpression.EVERY_WEEK)
    public async execute(): Promise<void> {
        const urls = await this.scrapingService.execute()

        urls.map(url => this.finderDownloaderQueue.add({ url }))
    }
}
