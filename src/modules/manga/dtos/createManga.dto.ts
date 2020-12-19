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
    title: string
    author: string
    pages: Page[]
}
