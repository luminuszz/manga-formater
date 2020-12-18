import * as puppeteer from 'puppeteer'
export interface IRequest {
    url: string
}

interface Page {
    img: string
    currentPage: number
}

export interface ExtractCap {
    pages: Page[]
    title: string
    author: string
    cap: number
}

type Span = HTMLSpanElement
type Img = HTMLImageElement

export class FinderService {
    public async luachBrowser(): Promise<puppeteer.Browser> {
        const browser = puppeteer.launch({
            headless: true,
        })

        return browser
    }

    private async extractPages(page: puppeteer.Page): Promise<ExtractCap> {
        const pages = []

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

        pages.push({ currentPage, img })

        const cap = await page.$eval('em[reader-current-chapter]', (e: Span) =>
            parseInt(e.innerText)
        )

        for (let l = 0; l < totalOfPages; l++) {
            await page.waitForTimeout(1000)

            await page.click('.page-next')

            const currentPage = await page.$eval(
                'em[reader-current-page]',
                (e: Span) => parseInt(e.innerText)
            )
            const img = await page.$eval(
                '.manga-image img',
                (img: Img) => img.src
            )
            pages.push({ currentPage: currentPage, img })
        }

        return {
            author,
            pages,
            title,
            cap,
        } as ExtractCap
    }

    public async execute(url: string): Promise<ExtractCap> {
        const browser = await this.luachBrowser()

        const page = await browser.newPage()

        await page.goto(url)

        const extract = await this.extractPages(page)

        console.log(extract)

        await browser.close()

        return extract
    }
}
