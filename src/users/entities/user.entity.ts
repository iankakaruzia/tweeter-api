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

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  bio: string

  @Column()
  profilePhoto: string

  @Column()
  coverPhoto: string

  @Column()
  isActive = true

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date
}
