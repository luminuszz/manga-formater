import { InjectQueue } from '@nestjs/bull'
import { Body, Controller, Post } from '@nestjs/common'
import { Queue } from 'bull'
import { QueueKeys } from '../queues'
import { ConverterService } from '../services/converter.service'
import { FinderService, IRequest } from '../services/finder.service'

@Controller('finder')
export class FinderController {
    constructor(
        @InjectQueue(QueueKeys.finderDownloader)
        private readonly addFinderServiceQueue: Queue<IRequest>,
        private readonly service: FinderService,
        private converterService: ConverterService
    ) {}

    @Post()
    public async activeFinderRequest(@Body('url') url: string): Promise<void> {
        await this.addFinderServiceQueue.add({ url })
    }
}
