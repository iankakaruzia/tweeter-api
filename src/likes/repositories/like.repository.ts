import { Comment } from 'src/comments/entities/comment.entity'
import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { Like } from '../entities/like.entity'

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async likeTweet(tweet: Tweet, user: User): Promise<Like> {
    const like = this.create()
    like.tweet = tweet
    like.author = user
    await this.save(like)
    return like
  }

  async likeComment(comment: Comment, user: User): Promise<Like> {
    const like = this.create()
    like.comment = comment
    like.author = user
    await this.save(like)
    return like
  }
}
