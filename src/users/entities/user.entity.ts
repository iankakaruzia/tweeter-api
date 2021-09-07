import { Exclude } from 'class-transformer'
import { Provider } from 'src/auth/enums/provider.enum'
import { Like } from 'src/likes/entities/like.entity'
import { Tweet } from 'src/tweets/entities/tweet.entity'
import { Save } from 'src/saves/entities/save.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Retweet } from 'src/retweets/entities/retweet.entity'
import { Comment } from 'src/comments/entities/comment.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  provider?: Provider

  @Index('provider_idx', { unique: true })
  @Column({ nullable: true, name: 'provider_id' })
  @Exclude()
  providerId?: string

  @Index('email_idx', { unique: true })
  @Column({ unique: true })
  email: string

  @Index('username_idx', { unique: true })
  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  @Exclude()
  password?: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true, name: 'profile_photo' })
  profilePhoto?: string

  @Column({ nullable: true, name: 'cover_photo' })
  coverPhoto?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  birthday?: Date

  @OneToMany((_type) => Tweet, (tweet) => tweet.author)
  tweets: Tweet[]

  @OneToMany((_type) => Like, (like) => like.author)
  likes: Like[]

  @OneToMany((_type) => Save, (save) => save.author)
  saves: Save[]

  @OneToMany((_type) => Retweet, (retweet) => retweet.author)
  retweets: Retweet[]

  @OneToMany((_type) => Comment, (comment) => comment.author)
  comments: Comment[]

  @Column({ default: false, name: 'is_active' })
  @Exclude()
  isActive: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @Exclude()
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  @Exclude()
  updatedAt: Date

  @Column({ nullable: true, name: 'reset_password_token' })
  @Exclude()
  resetPasswordToken?: string

  @Column({ nullable: true, name: 'reset_password_expiration', type: 'bigint' })
  @Exclude()
  resetPasswordExpiration?: number

  @Column({ nullable: true, name: 'confirmation_token' })
  @Exclude()
  confirmationToken: string
}
