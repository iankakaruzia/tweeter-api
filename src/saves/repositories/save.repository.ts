import { Post } from 'src/posts/entities/post.entity'
import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { Save } from '../entities/save.entity'

@EntityRepository(Save)
export class SaveRepository extends Repository<Save> {
  async addSave(post: Post, user: User): Promise<Save> {
    const save = this.create()
    save.post = post
    save.author = user
    await this.save(save)
    return save
  }
}
