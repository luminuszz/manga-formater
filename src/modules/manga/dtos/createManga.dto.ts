export class Page {
    currentPage: number

    img: string
}

export class Chapter {
    chapterNumber: number

    pages: Page[]
}

export class createMangaDTO {
    cap: number
    slug: string
    title: string
    author: string
    pages: Page[]
}
