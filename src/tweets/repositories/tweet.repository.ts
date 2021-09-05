import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { CreateTweetDto } from '../dtos/create-tweet.dto'
import { Tweet } from '../entities/tweet.entity'

@EntityRepository(Tweet)
export class TweetRepository extends Repository<Tweet> {
  async createTweet(
    createTweetDto: CreateTweetDto,
    user: User
  ): Promise<Tweet> {
    const tweet = this.create()
    Object.assign(tweet, createTweetDto)
    tweet.author = user
    await this.save(tweet)
    return tweet
  }
}
