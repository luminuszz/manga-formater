import { Injectable } from '@nestjs/common'
import * as IlovepdfSDK from 'ilovepdf-sdk'

import * as fs from 'fs'

import { join } from 'path'

const path = join(__dirname, '..', '..', '..', '..', 'temp')
const outPath = join(__dirname, '..', '..', '..', '..', 'download')

export interface GetParams {
    title: string
    cap: number
}

@Injectable()
export class ConverterService {
    private async getFiles(): Promise<string[]> {
        const fsp = fs.promises

        const listDicrecotry = await fsp.readdir(path)

        return listDicrecotry
    }

    public async execute({ cap, title }: GetParams): Promise<void> {
        console.log('foi chamado')

        const fsp = fs.promises

        const sdk = new IlovepdfSDK(
            process.env.LOVE_PDF_PROJECT_KEY,
            process.env.LOVE_PDF_SECRET_KEY
        )

        const task = await sdk.createTask('imagepdf')
        const images = await this.getFiles()

        images.map(async image => {
            await task.addFile(`${path}/${image}`)
            await task.process()
            await task.download(`${outPath}/${title}-cap${cap}.pdf`)
        })

        images.map(async image => {
            await fsp.unlink(`${path}/${image}`)
        })
    }
}
