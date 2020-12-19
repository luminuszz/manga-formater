import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm'

export class Page {
    @Column()
    pageNumber: number

    @Column()
    img: string

    constructor(pageNumber: number, img: string) {
        this.pageNumber = pageNumber
        this.img = img
    }
}

export class Chapter {
    @Column()
    chapterNumber: number

    @Column(() => Page)
    pages: Page[]

    constructor(chapterNumber: number, pages: Page[]) {
        this.chapterNumber = chapterNumber
        this.pages = pages
    }
}

@Entity()
export class Manga {
    @ObjectIdColumn()
    id: ObjectID

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    author: string

    @Column(() => Chapter)
    chapters: Chapter[]
}
