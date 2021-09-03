import { Transform } from 'class-transformer'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  content?: string

  @Column({ nullable: true, name: 'image_url' })
  imageUrl?: string

  @Column({ default: true, name: 'is_public' })
  isPublic?: boolean

  @ManyToOne((_type) => User, (user) => user.posts)
  @Transform(({ value }) => ({
    id: value.id,
    name: value.name,
    username: value.username,
    profilePhoto: value.profilePhoto
  }))
  author: User

  @Column()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
