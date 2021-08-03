import { Provider } from 'src/auth/enums/provider.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  @Index({ unique: true })
  id: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  provider?: Provider

  @Column({ nullable: true })
  providerId?: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  password?: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  profilePhoto?: string

  @Column({ nullable: true })
  coverPhoto?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  birthday?: Date

  @Column()
  isActive: boolean

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  resetPasswordToken?: string

  @Column({ nullable: true })
  resetPasswordExpiration?: number

  @Column()
  confirmationToken: string
}
