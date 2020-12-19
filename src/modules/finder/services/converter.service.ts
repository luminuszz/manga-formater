import { Injectable } from '@nestjs/common'
import * as FormData from 'form-data'

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

    private async sendToService(
        task: string,
        server: string,
        page: string
    ): Promise<string> {
        const form = new FormData()

        const file = {
            local: '',
            server: '',
        }

        file.local = `${path}/${page}`

        const stream = fs.createReadStream(`${path}/${page}`)

        form.append('file', stream)

        form.append('task', task)

        // eslint-disable-next-line camelcase
        const responseUpload = await api.post<{ server_filename: string }>(
            `https://${server}/v1/upload`,
            form,
            {
                headers: form.getHeaders(),
            }
        )

        file.server = responseUpload.data.server_filename

        this.files.push(file)

        return responseUpload.data.server_filename
    }

    public async execute({ cap, title }: GetParams): Promise<void> {
        const serverResponse = await api.get<ServerResponse>(
            'https://api.ilovepdf.com/v1/start/imagepdf'
        )

        const { server, task } = serverResponse.data

        const pages = await this.getFiles()

        console.log('servidores recuperados')

        for (let l = 0; l < pages.length; l++) {
            const teste = await this.sendToService(task, server, pages[l])

            this.files.push({
                server_filename: teste,
                filename: basename(`${pages}/${pages[l]}`),
            })
        }
        console.log('pages enviadas')

        console.log(this.files)

        const payload = {
            task,
            tool: 'imagepdf',
            files: this.files,
            metas: {
                pagesize: 'fit',
            },
        }

        console.log('Começando processo')

        const teste = await api.post(`https://${server}/v1/process`, payload)

        console.log(teste)
    }
}
