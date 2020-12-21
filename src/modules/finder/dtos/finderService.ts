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
}

export type Span = HTMLSpanElement
export type Img = HTMLImageElement
