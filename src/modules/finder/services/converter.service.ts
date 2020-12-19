import { Injectable } from '@nestjs/common'
import * as IlovepdfSDK from 'ilovepdf-sdk'
import * as rimraf from 'rimraf'

import * as fs from 'fs'

import { join } from 'path'

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

    private async getFiles(
        folderTitle: string,
        cap: number
    ): Promise<{ path: string; listDicrecotry: string[] }> {
        const path = join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'temp',
            `${folderTitle}-cap-${cap}`
        )

        const fsp = fs.promises

        const listDicrecotry = await fsp.readdir(path)

        return { listDicrecotry, path }
    }

    public async execute({ cap, title }: GetParams): Promise<void> {
        const sdk = new IlovepdfSDK(
            process.env.LOVE_PDF_PROJECT_KEY,
            process.env.LOVE_PDF_SECRET_KEY
        )

        const { listDicrecotry, path } = await this.getFiles(title, cap)

        const task = await sdk.createTask('imagepdf')

        for (let l = 0; l < listDicrecotry.length; l++) {
            await task.addFile(`${path}/${listDicrecotry[l]}`)
        }

        await task.process()

        await task.download(`${outPath}/${title}-${cap}.pdf`)

        listDicrecotry.forEach(
            async page => await fs.promises.unlink(`${path}/${page}`)
        )
        rimraf(path, () => console.log('diretorio apagado'))

        console.log(
            'Processo finalizado e arquivos apagados, verificar pasta download'
        )
    }
}
