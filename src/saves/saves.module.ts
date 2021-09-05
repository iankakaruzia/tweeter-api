import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TweetsModule } from 'src/tweets/tweets.module'
import { SaveRepository } from './repositories/save.repository'
import { SavesResolver } from './saves.resolver'
import { SavesService } from './saves.service'

@Module({
  imports: [TypeOrmModule.forFeature([SaveRepository]), TweetsModule],
  providers: [SavesService, SavesResolver]
})
export class SavesModule {}
