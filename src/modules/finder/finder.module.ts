import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { FinderController } from './controllers/finder.controller'
import { FindDerDownloaderConsumer } from './queues/finderDowloaer.queue'
import { SaveFileQueueProcess } from './queues/saveFile.queue'
import { FinderService } from './services/finder.service'
import { QueueKeys } from './queues'
import { SaveService } from './services/save.service'
import { ConverterService } from './services/converter.service'
import { ConverterFileProcess } from './queues/converterPdf.queue'
import { MangaModule } from '../manga/manga.module'

@Module({
    imports: [
        BullModule.registerQueue({
            name: QueueKeys.finderDownloader,
        }),
        BullModule.registerQueue({
            name: QueueKeys.saveFile,
        }),
        BullModule.registerQueue({
            name: QueueKeys.converterFile,
        }),
        MangaModule,
    ],
    providers: [
        FinderService,
        FindDerDownloaderConsumer,
        SaveFileQueueProcess,
        ConverterFileProcess,
        SaveService,
        ConverterService,
    ],
    controllers: [FinderController],
})
export class FinderModule {}
