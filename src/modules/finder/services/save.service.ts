import { Injectable } from '@nestjs/common'
import { ExtractCap } from './finder.service'
import { join } from 'path'
import * as fetch from 'node-fetch'

import * as fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueKeys } from '../queues'
import { Queue } from 'bull'
import { GetParams } from '../services/converter.service'

@Injectable()
export class SaveService {
    constructor(
        @InjectQueue(QueueKeys.converterFile)
        private readonly converterQueue: Queue<GetParams>
    ) {}

    private async renderImage(url: string, fileName: string, path: string) {
        try {
            const response = await fetch(url)

            const buffer = await response.buffer()

            await fs.promises.writeFile(`${path}/${fileName}`, buffer)

            console.log(`check -> ${fileName},`)
        } catch (error) {
            console.log(`error -> ${fileName}`)
        }
    }

    public async execute(data: ExtractCap): Promise<void> {
        const folder = join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'temp',
            `${data.title}-cap-${data.cap}`
        )

        await fs.promises.mkdir(folder)

        data.pages.map(async page => {
            await this.renderImage(page.img, `${page.currentPage}.jpg`, folder)
        })
    }
}
