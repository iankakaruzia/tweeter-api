import { Like } from 'src/likes/entities/like.entity'
import { Tweet } from 'src/tweets/entities/tweet.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  content?: string

  @Column({ nullable: true, name: 'image_url' })
  imageUrl?: string

  @ManyToOne((_type) => User, (user) => user.comments, { eager: true })
  author: User

  @ManyToOne((_type) => Tweet, (tweet) => tweet.comments, { eager: true })
  tweet: Tweet

  @OneToMany((_type) => Like, (like) => like.comment)
  likes: Like[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
