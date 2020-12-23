import { Module } from '@nestjs/common'
import { HashService } from './hash.service'
import { HashProvider } from './implementations'

@Module({
  providers: [HashService, HashProvider],
  exports: [HashService],
})
export class HashModuleProvider {}
