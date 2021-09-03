import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { CreatePostDto } from '../dtos/create-post.dto'
import { Post } from '../entities/post.entity'

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.create()
    Object.assign(post, createPostDto)
    post.author = user
    await this.save(post)
    return post
  }
}
