import { Injectable } from '@nestjs/common'
import { ExtractCap } from './finder.service'
import { join } from 'path'
import * as fetch from 'node-fetch'

import * as fs from 'fs'

@Injectable()
export class SaveService {
    private async renderImage(url: string, fileName: string) {
        const temp = (fileName: string) =>
            join(__dirname, '..', '..', '..', '..', 'temp', fileName)

        const response = await fetch(url)
        const buffer = await response.buffer()
        fs.writeFile(temp(fileName), buffer, data =>
            console.log('finished downloading!', data)
        )
    }

    public async execute(data: ExtractCap): Promise<ExtractCap> {
        data.pages.map(async page => {
            await this.renderImage(page.img, `page-${page.currentPage}.jpg`)
        })

        return data
    }
}
