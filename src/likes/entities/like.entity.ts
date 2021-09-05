import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_type) => User, (user) => user.likes, { eager: true })
  author: User

  @ManyToOne((_type) => Tweet, (tweet) => tweet.likes, { eager: true })
  tweet: Tweet

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
