import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TweetsService } from 'src/tweets/tweets.service'
import { User } from 'src/users/entities/user.entity'
import { RetweetRepository } from './repositories/retweet.repository'

@Injectable()
export class RetweetsService {
  constructor(
    private tweetsService: TweetsService,
    @InjectRepository(RetweetRepository)
    private retweetRepository: RetweetRepository
  ) {}

  async retweet(tweetId: number, user: User) {
    const tweet = await this.tweetsService.getTweet(tweetId)
    return this.retweetRepository.addRetweet(tweet, user)
  }

  async removeRetweet(saveId: number, user: User) {
    const retweet = await this.retweetRepository.findOne(saveId)

    if (!retweet) {
      throw new NotFoundException('Unable to find the retweet')
    }

    if (retweet.author.id !== user.id) {
      throw new ForbiddenException('Only the user that retweeted can remove it')
    }

    await this.retweetRepository.remove(retweet)
  }
}
