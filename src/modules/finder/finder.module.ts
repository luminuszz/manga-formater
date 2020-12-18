import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { FinderController } from './controllers/finder.controller'
import { FindDerDownloaderConsumer } from './queues/finderDowloaer.queue'
import { SaveFileQueueProcess } from './queues/saveFile.queue'
import { FinderService } from './services/finder.service'
import { QueueKeys } from './queues'
import { SaveService } from './services/save.service'

@Module({
    imports: [
        BullModule.registerQueue({
            name: QueueKeys.finderDownloader,
        }),
        BullModule.registerQueue({
            name: QueueKeys.saveFile,
        }),
    ],
    providers: [
        FinderService,
        FindDerDownloaderConsumer,
        SaveFileQueueProcess,
        SaveService,
    ],
    controllers: [FinderController],
})
export class FinderModule {}
