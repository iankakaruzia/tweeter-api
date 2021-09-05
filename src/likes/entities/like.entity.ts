import { Post } from 'src/posts/entities/post.entity'
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

  @ManyToOne((_type) => Post, (post) => post.likes, { eager: true })
  post: Post

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
