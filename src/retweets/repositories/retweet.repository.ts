import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { Retweet } from '../entities/retweet.entity'

@EntityRepository(Retweet)
export class RetweetRepository extends Repository<Retweet> {
  async addRetweet(tweet: Tweet, user: User) {
    const retweet = this.create()
    retweet.tweet = tweet
    retweet.author = user
    await this.save(retweet)
    return retweet
  }
}
