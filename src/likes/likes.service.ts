import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsService } from 'src/posts/posts.service'
import { User } from 'src/users/entities/user.entity'
import { LikeRepository } from './repositories/like.repository'

@Injectable()
export class LikesService {
  constructor(
    private postsService: PostsService,
    @InjectRepository(LikeRepository) private likeRepository: LikeRepository
  ) {}

  async like(postId: number, user: User) {
    const post = await this.postsService.getPost(postId)
    return this.likeRepository.addLike(post, user)
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
