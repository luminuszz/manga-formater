import * as IlovepdfSDK from 'ilovepdf-sdk'
import * as rimraf from 'rimraf'
import * as fs from 'fs'
import * as JsZip from 'jszip'

import { Injectable } from '@nestjs/common'
import { outPath } from '../dtos/constants'
import { GetParams, ILovePdfSDK, ProcessParams } from '../dtos/converterService'
import { join } from 'path'

export abstract class ConverterService {
    private async getFiles(
        folderTitle: string,
        cap: number
    ): Promise<{ path: string; listDirectory: string[] }> {
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

        return { listDirectory: listDicrecotry, path }
    }

    private orderPages(listDirectory: string[]): string[] {
        const transform = listDirectory
            .map(page => Number(page.replace('.jpg', '')))
            .sort((a, b) => a - b)
            .map(pageNumber => `${pageNumber}.jpg`)

        return transform
    }

    private async removeDirectories(
        listDirectory: string[],
        path: string
    ): Promise<void> {
        for (const page of listDirectory) {
            await fs.promises.unlink(`${path}/${page}`)
        }

        rimraf(path, () => console.log('diretorio apagado'))
    }

    protected abstract ConverterProviderService(
        data: ProcessParams
    ): Promise<void>

    public async execute({ cap, title }: GetParams): Promise<void> {
        try {
            const { listDirectory, path } = await this.getFiles(title, cap)

            const filesArray = this.orderPages(listDirectory)

            await this.ConverterProviderService({
                cap,
                title,
                filesArray,
                path,
            })

            this.removeDirectories(listDirectory, path)

            console.log(
                'Processo finalizado e arquivos apagados, verificar pasta download'
            )
        } catch (error) {
            console.log(error)
        }
    }
}

@Injectable()
class ILovePDfConverterService extends ConverterService {
    private _sdk: ILovePdfSDK

    private get sdk(): ILovePdfSDK {
        return this._sdk
    }

    private set sdk(sdkInstance: ILovePdfSDK) {
        this._sdk = sdkInstance
    }

    constructor() {
        super()
        this.sdk = new IlovepdfSDK(
            process.env.LOVE_PDF_PROJECT_KEY,
            process.env.LOVE_PDF_SECRET_KEY
        )
    }

    protected async ConverterProviderService({
        cap,
        filesArray,
        path,
        title,
    }: ProcessParams): Promise<void> {
        const task = await this.sdk.createTask('imagepdf')

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
}

@Injectable()
class ZipFIleConverterService extends ConverterService {
    private _jsZip: JsZip

    private get jsZip(): JsZip {
        return this._jsZip
    }

    private set jsZip(sdkInstance: JsZip) {
        this._jsZip = sdkInstance
    }

    constructor() {
        super()
        this.jsZip = new JsZip()
    }

    protected async ConverterProviderService(
        data: ProcessParams
    ): Promise<void> {
        for (const page of data.filesArray) {
            this.jsZip.file(page, `${data.path}/${page}`, {
                createFolders: false,
                dir: false,
            })
        }

        this.jsZip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(
                fs.createWriteStream(`${outPath}/${data.title}-${data.cap}.zip`)
            )
            .on('finish', () => {
                console.log('finish')
            })
    }
}

export const ConverterServiceInstance = {
    provide: ConverterService,
    useClass: ZipFIleConverterService,
}
