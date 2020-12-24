import { Injectable } from '@nestjs/common'
import * as puppeteer from 'puppeteer'

@Injectable()
export class ScrappingService {
    public async execute(): Promise<string[]> {
        const BASE_URL = 'https://mangalivre.net/'

        const browser = await puppeteer.launch({ headless: true })

        const page = await browser.newPage()

        await page.goto(BASE_URL, { waitUntil: 'networkidle2' })

        const links = await page.$$eval(
            '.touchcarousel-wrapper .item a',
            (as: HTMLLinkElement[]) => as.map(a => a.href)
        )

        await browser.close()

        console.log(links)

        return links
    }
}
