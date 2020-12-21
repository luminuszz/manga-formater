enum dataPosition {
    title = 4,
    cap = 7,
}

export interface DataExtract {
    title: string
    cap: number
    currentUrl: string
}

export function extractTUrl(urls: string[]): DataExtract[] {
    const rgx = new RegExp(/-/gi)

    const extractData = urls.map(url => {
        const split = url.split('/')

        return {
            currentUrl: url,
            title: split[dataPosition.title]
                .replace(rgx, ' ')
                .replace(/\./gi, ''),
            cap: parseInt(split[dataPosition.cap].replace('capitulo-', '')),
        }
    })

    return extractData
}
