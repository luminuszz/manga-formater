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
        private converterService: ConverterService,
        private finderService: FinderService
    ) {}

    @Post()
    public async activeFinderRequest(
        @Body('paths') paths: string[]
    ): Promise<void> {
        //  await this.finderService.execute(paths[0])
        await this.converterService.execute({ cap: 5, title: '' })
        /* 
        paths.map(async url => {
            this.addFinderServiceQueue.add({ url })
        }) */
    }
}
