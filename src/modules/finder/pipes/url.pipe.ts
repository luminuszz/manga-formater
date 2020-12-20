import { ArgumentMetadata, PipeTransform } from '@nestjs/common'

export class URLFormatter implements PipeTransform {
    public transform(urls: string[], _: ArgumentMetadata): string[] {
        const removeRepeatsUrls = urls.filter(
            (url, index) => urls.indexOf(url) === index
        )

        return removeRepeatsUrls
    }
}
