import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostsService } from 'src/posts/posts.service'
import { User } from 'src/users/entities/user.entity'
import { SaveRepository } from './repositories/save.repository'

@Injectable()
export class SavesService {
  constructor(
    private postsService: PostsService,
    @InjectRepository(SaveRepository) private saveRepository: SaveRepository
  ) {}

  async save(postId: number, user: User) {
    const post = await this.postsService.getPost(postId)
    return this.saveRepository.addSave(post, user)
  }

  async removeSave(saveId: number, user: User) {
    const save = await this.saveRepository.findOne(saveId)

    if (!save) {
      throw new NotFoundException('Unable to find the save')
    }

    if (save.author.id !== user.id) {
      throw new ForbiddenException('Only the user that saved can remove it')
    }

    await this.saveRepository.remove(save)
  }
}
