export interface IRequest {
    url: string
}

export interface Page {
    img: string
    currentPage: number
}

export interface ExtractCap {
    pages: Page[]
    title: string
    author: string
    cap: number
    slug: string
    posterImage: string
}

export type Span = HTMLSpanElement
export type Img = HTMLImageElement
export type Div = HTMLDivElement
