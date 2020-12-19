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
import { FinderService, IRequest, ExtractCap } from '../services/finder.service'

import { QueueKeys } from './index'

@Processor(QueueKeys.finderDownloader)
@Injectable()
export class FindDerDownloaderConsumer {
    constructor(
        private readonly findService: FinderService,
        @InjectQueue(QueueKeys.saveFile)
        private readonly saveFileQueue: Queue<ExtractCap>
    ) {}

    @Process()
    public async activeFinderService(job: Job<IRequest>): Promise<any> {
        return await this.findService.execute(job.data.url)
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
    private completed(job: Job, data: ExtractCap) {
        //   this.saveFileQueue.add(data)
    }
}
