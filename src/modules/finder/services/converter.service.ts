/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface ILovePdfSDK {
    createTask: (taskToken: string) => Promise<any>
    addFile: (filePath: string) => Promise<any>
    process: () => Promise<any>
    download: (outDirectory: string) => Promise<any>
}

interface ILovePDfProcess {
    filesArray: string[]
    path: string
    sdk: ILovePdfSDK
    title: string
    cap: number
}

@Injectable()
export class ConverterService {
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

    private orderPages(listDicrecotry: string[]): string[] {
        const transform = listDicrecotry
            .map(page => Number(page.replace('.jpg', '')))
            .sort((a, b) => a - b)
            .map(pageNumber => `${pageNumber}.jpg`)

        return transform
    }

    private removeDirectories(listDicrecotry: string[], path: string) {
        listDicrecotry.forEach(
            async page => await fs.promises.unlink(`${path}/${page}`)
        )

        rimraf(path, () => console.log('diretorio apagado'))
    }

    private async ILovePdfProcess({
        cap,
        filesArray,
        path,
        sdk,
        title,
    }: ILovePDfProcess) {
        const task = await sdk.createTask('imagepdf')

        console.log('Requisição de trabalho a i love dpf inciada')
        console.log('Começando processo de envio das paginas')

        for (const page of filesArray) {
            console.log(`Enviando -> page ${page}`)
            await task.addFile(`${path}/${page}`)
            console.log(`Enviada -> page ${page}`)
        }

        console.log('Enviando requisição de processamento')

        await task.process()

        console.log('Processamento completo, começando requisição de download')

        await task.download(`${outPath}/${title}-cap-${cap}.pdf`)
    }

    public async execute({ cap, title }: GetParams): Promise<void> {
        try {
            const sdk = new IlovepdfSDK(
                process.env.LOVE_PDF_PROJECT_KEY,
                process.env.LOVE_PDF_SECRET_KEY
            ) as ILovePdfSDK

            const { listDicrecotry, path } = await this.getFiles(title, cap)

            const filesArray = this.orderPages(listDicrecotry)

            await this.ILovePdfProcess({
                cap,
                title,
                filesArray,
                path,
                sdk,
            })

            this.removeDirectories(listDicrecotry, path)

            console.log(
                'Processo finalizado e arquivos apagados, verificar pasta download'
            )
        } catch (error) {
            console.log(error)
        }
    }
}
