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
import { ConverterService } from '../services/converter.service'
import { ExtractCap } from '../services/finder.service'

import { QueueKeys } from './index'

@Processor(QueueKeys.converterFile)
@Injectable()
export class ConverterFileProcess {
    constructor(private readonly converService: ConverterService) {}

    @Process()
    public async activeConverService(job: Job<ExtractCap>): Promise<void> {
        console.log('teste')

        return await this.converService.execute({
            cap: job.data.cap,
            title: job.data.title,
        })
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
