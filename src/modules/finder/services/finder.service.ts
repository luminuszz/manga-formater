import { EventEmitter2 } from '@nestjs/event-emitter'
import * as puppeteer from 'puppeteer'
import { Injectable } from '@nestjs/common'
import { MangaEvent } from 'src/modules/manga/events/registerManga.event'
import { ExtractCap, Page, Img, Span } from '../dtos/finderService'

@Injectable()
export class FinderService {
    private _pages: Page[]

    private get pages(): Page[] {
        return this._pages
    }

    constructor(private readonly eventEmitter: EventEmitter2) {
        this._pages = []
    }

    public async lunchBrowser(): Promise<puppeteer.Browser> {
        const browser = puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
        })

        return browser
    }

    private async extractPages(page: puppeteer.Page): Promise<ExtractCap> {
        const title = await page.$eval('.title', (span: Span) => span.innerText)

        const author = await page.$eval(
            '.author',
            (span: Span) => span.innerText
        )

        const totalOfPages = await page.$eval(
            'em[reader-total-pages]',
            (e: Span) => parseInt(e.innerText)
        )

        const currentPage = await page.$eval(
            'em[reader-current-page]',
            (e: Span) => parseInt(e.innerText)
        )

        const img = await page.$eval('.manga-image img', (img: Img) => img.src)

        this._pages.push({ currentPage, img })

        const cap = await page.$eval('em[reader-current-chapter]', (e: Span) =>
            parseInt(e.innerText)
        )

        for (let l = 0; l < totalOfPages; l++) {
            await page.waitForTimeout(1500)

            await page.click('.page-next')

            const currentPage = await page.$eval(
                'em[reader-current-page]',
                (e: Span) => parseInt(e.innerText)
            )
            const img = await page.$eval(
                '.manga-image img',
                (img: Img) => img.src
            )
            this._pages.push({ currentPage: currentPage, img })
        }

        return {
            author,
            pages: this.pages,
            title,
            cap,
        } as ExtractCap
    }

    public async execute(url: string): Promise<ExtractCap> {
        try {
            const browser = await this.lunchBrowser()

            const page = await browser.newPage()

            await page.goto(url)

            const extract = await this.extractPages(page)

            await browser.close()

            this.eventEmitter.emit(MangaEvent.mangaExtract, extract)

            const formatExtract: ExtractCap = {
                ...extract,
                title: extract.title.replace(/\./gi, '').toLowerCase(),
            }

            return formatExtract
        } catch (error) {
            console.log(error)
        }
    }
}
