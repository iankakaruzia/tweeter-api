import { Provider } from 'src/auth/enums/provider.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  provider?: Provider

  @Index('provider_idx', { unique: true })
  @Column({ nullable: true, name: 'provider_id' })
  providerId?: string

  @Index('email_idx', { unique: true })
  @Column({ unique: true })
  email: string

  @Index('username_idx', { unique: true })
  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
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

  @Column({ default: false, name: 'is_active' })
  isActive: boolean

  @Column()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ nullable: true, name: 'reset_password_token' })
  resetPasswordToken?: string

  @Column({ nullable: true, name: 'reset_password_expiration' })
  resetPasswordExpiration?: number

  @Column({ nullable: true, name: 'confirmation_token' })
  confirmationToken: string
}
