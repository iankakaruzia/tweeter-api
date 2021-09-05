import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { Save } from '../entities/save.entity'

@EntityRepository(Save)
export class SaveRepository extends Repository<Save> {
  async addSave(tweet: Tweet, user: User): Promise<Save> {
    const save = this.create()
    save.tweet = tweet
    save.author = user
    await this.save(save)
    return save
  }
}
