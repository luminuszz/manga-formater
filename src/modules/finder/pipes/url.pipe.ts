import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { DataExtract, extractTUrl } from 'src/shared/utils/extractorUrl'

export class URLFormatter implements PipeTransform {
    public transform(urls: string[], _: ArgumentMetadata): any[] {
        const removedRepeatsUrls = urls.filter(
            (url, index) => urls.indexOf(url) === index
        )

        console.log(removedRepeatsUrls)

        return extractTUrl(removedRepeatsUrls)
    }
}
