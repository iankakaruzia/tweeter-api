import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadModule } from 'src/upload/upload.module'
import { TweetRepository } from './repositories/tweet.repository'
import { TweetsResolver } from './tweets.resolver'
import { TweetsService } from './tweets.service'

@Module({
  imports: [TypeOrmModule.forFeature([TweetRepository]), UploadModule],
  providers: [TweetsResolver, TweetsService],
  exports: [TweetsService]
})
export class TweetsModule {}
