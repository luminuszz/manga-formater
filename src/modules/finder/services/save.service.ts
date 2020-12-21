import { Injectable } from '@nestjs/common'
import { ExtractCap } from '../dtos/finderService'
import { join } from 'path'
import * as fetch from 'node-fetch'

import * as fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueKeys } from '../queues'
import { Queue } from 'bull'
import { GetParams } from '../dtos/converterService'

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
        const formatterTitle = data.title.replace(/\s/g, '-')

        const folder = join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'temp',
            `${formatterTitle}-cap-${data.cap}`
        )

        await fs.promises.mkdir(folder)

        for (let l = 0; l < data.pages.length; l++) {
            await this.renderImage(
                data.pages[l].img,
                `${data.pages[l].currentPage}.jpg`,
                folder
            )
        }
        const { cap } = data

        this.converterQueue.add({ cap, title: formatterTitle })
    }
}
