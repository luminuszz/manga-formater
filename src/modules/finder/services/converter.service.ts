import { Injectable } from '@nestjs/common'
import * as IlovepdfSDK from 'ilovepdf-sdk'

import * as fs from 'fs'

import { join, basename } from 'path'
import { async } from 'rxjs'
import { api } from 'src/config/api.config'

const path = join(__dirname, '..', '..', '..', '..', 'temp')
const outPath = join(__dirname, '..', '..', '..', '..', 'download')

export interface GetParams {
    title: string
    cap: number
}

interface ServerResponse {
    server: string
    task: string
}

@Injectable()
export class ConverterService {
    private files = []

    constructor() {
        this.files = []
    }

    private async getFiles(): Promise<string[]> {
        const fsp = fs.promises

        const listDicrecotry = await fsp.readdir(path)

        return listDicrecotry
    }

    public async execute({ cap, title }: GetParams): Promise<void> {
        const sdk = new IlovepdfSDK(
            process.env.LOVE_PDF_PROJECT_KEY,
            process.env.LOVE_PDF_SECRET_KEY
        )

        const pages = await this.getFiles()

        const task = await sdk.createTask('imagepdf')

        for (let l = 0; l < pages.length; l++) {
            await task.addFile(`${path}/${pages[l]}`)
        }

        await task.process()

        await task.download(`${outPath}/${title}-${cap}.pdf`)
    }
}
