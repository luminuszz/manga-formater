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
import { GetParams } from '../dtos/converterService'
import { ExtractCap } from '../dtos/finderService'
import { SaveService } from '../services/save.service'

import { QueueKeys } from './index'

@Processor(QueueKeys.saveFile)
@Injectable()
export class SaveFileQueueProcess {
    constructor(
        private readonly saveService: SaveService,
        @InjectQueue(QueueKeys.converterFile)
        private readonly converterQueue: Queue<GetParams>
    ) {}

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
        console.log(
            `job ${job.id} da fila ${job.name} finalizado, enviado para fila de conversão...`
        )

        this.converterQueue.add(job.data)
    }
}
