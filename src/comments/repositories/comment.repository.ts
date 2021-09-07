import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { AddCommentDto } from '../dtos/add-comment.dto'
import { Comment } from '../entities/comment.entity'

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async addComment(addCommentDto: AddCommentDto, user: User): Promise<Comment> {
    const comment = this.create()
    comment.author = user
    Object.assign(comment, addCommentDto)
    await this.save(comment)
    return comment
  }
}
