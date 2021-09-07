import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'saves' })
export class Save {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_type) => User, (user) => user.saves, { eager: true })
  author: User

  @ManyToOne((_type) => Tweet, (tweet) => tweet.saves, { eager: true })
  tweet: Tweet

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
