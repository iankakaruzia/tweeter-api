import { Transform } from 'class-transformer'
import { Like } from 'src/likes/entities/like.entity'
import { Save } from 'src/saves/entities/save.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @ManyToOne((_type) => User, (user) => user.posts, { eager: true })
  @Transform(({ value }) => ({
    id: value.id,
    name: value.name,
    username: value.username,
    profilePhoto: value.profilePhoto
  }))
  author: User

  @OneToMany((_type) => Like, (like) => like.post)
  likes: Like[]

  @OneToMany((_type) => Save, (save) => save.post)
  saves: Save[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
