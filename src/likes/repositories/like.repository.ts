import { Post } from 'src/posts/entities/post.entity'
import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { Like } from '../entities/like.entity'

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async addLike(post: Post, user: User): Promise<Like> {
    const like = this.create()
    like.post = post
    like.author = user
    await this.save(like)
    return like
  }
}
