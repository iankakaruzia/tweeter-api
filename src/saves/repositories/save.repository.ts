import { PaginationArgs } from 'src/common/pagination/models/pagination.args'
import { paginate } from 'src/common/pagination/paginate'
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

  async getSaves(paginationArgs: PaginationArgs, user: User) {
    const query = this.createQueryBuilder('save')
      .leftJoinAndSelect('save.tweet', 'tweet')
      .leftJoinAndSelect('tweet.author', 'author')
      .where('save.authorId = :id', { id: user.id })
      .select()
    return paginate({
      query,
      cursorColumn: 'save.id',
      paginationArgs
    })
  }
}
