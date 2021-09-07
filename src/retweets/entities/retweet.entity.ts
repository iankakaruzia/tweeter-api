import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'retweets' })
export class Retweet {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_type) => User, (user) => user.retweets, { eager: true })
  author: User

  @ManyToOne((_type) => Tweet, (tweet) => tweet.retweets, { eager: true })
  tweet: Tweet

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
