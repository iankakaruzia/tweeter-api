import { Post } from 'src/posts/entities/post.entity'
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

  @ManyToOne((_type) => Post, (post) => post.saves, { eager: true })
  post: Post

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
