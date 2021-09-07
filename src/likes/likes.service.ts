import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentsService } from 'src/comments/comments.service'
import { TweetsService } from 'src/tweets/tweets.service'
import { User } from 'src/users/entities/user.entity'
import { LikeRepository } from './repositories/like.repository'

@Injectable()
export class LikesService {
  constructor(
    private tweetsService: TweetsService,
    private commentsService: CommentsService,
    @InjectRepository(LikeRepository) private likeRepository: LikeRepository
  ) {}

  async likeTweet(tweetId: number, user: User) {
    const tweet = await this.tweetsService.getTweet(tweetId)
    return this.likeRepository.likeTweet(tweet, user)
  }

  async likeComment(commentId: number, user: User) {
    const comment = await this.commentsService.getComment(commentId)
    return this.likeRepository.likeComment(comment, user)
  }

  async dislike(likeId: number, user: User) {
    const like = await this.likeRepository.findOne(likeId)

    if (!like) {
      throw new NotFoundException('Unable to find a like')
    }

    if (like.author.id !== user.id) {
      throw new ForbiddenException('Only the user that liked can dislike')
    }

    await this.likeRepository.remove(like)
  }
}
