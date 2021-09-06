import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TweetsModule } from 'src/tweets/tweets.module'
import { RetweetRepository } from './repositories/retweet.repository'
import { RetweetsResolver } from './retweets.resolver'
import { RetweetsService } from './retweets.service'

@Module({
  imports: [TypeOrmModule.forFeature([RetweetRepository]), TweetsModule],
  providers: [RetweetsService, RetweetsResolver]
})
export class RetweetsModule {}
