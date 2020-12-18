import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    OnQueueProgress,
    Process,
    Processor,
} from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Job } from 'bull'
import { ExtractCap } from '../services/finder.service'
import { SaveService } from '../services/save.service'

import { QueueKeys } from './index'

@Processor(QueueKeys.saveFile)
@Injectable()
export class SaveFileQueueProcess {
    constructor(private readonly saveService: SaveService) {}

    @Process()
    public async execute(job: Job<ExtractCap>): Promise<void> {
        await this.saveService.execute(job.data)
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
    private completed(job: Job<ExtractCap>) {
        console.log(`completed job ${job.id}`)
    }
}
