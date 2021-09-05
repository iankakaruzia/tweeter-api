import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TweetsService } from 'src/tweets/tweets.service'
import { User } from 'src/users/entities/user.entity'
import { SaveRepository } from './repositories/save.repository'

@Injectable()
export class SavesService {
  constructor(
    private tweetsService: TweetsService,
    @InjectRepository(SaveRepository) private saveRepository: SaveRepository
  ) {}

  async save(tweetId: number, user: User) {
    const tweet = await this.tweetsService.getTweet(tweetId)
    return this.saveRepository.addSave(tweet, user)
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
