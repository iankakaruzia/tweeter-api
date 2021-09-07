import { Comment } from 'src/comments/entities/comment.entity'
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

  @ManyToOne((_type) => Tweet, (tweet) => tweet.likes, {
    eager: true,
    nullable: true
  })
  tweet: Tweet

  @ManyToOne((_type) => Comment, (comment) => comment.likes, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE'
  })
  comment: Comment

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
