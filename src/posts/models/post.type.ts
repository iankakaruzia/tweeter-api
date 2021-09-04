import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Post')
export class PostType {
  @Field((_type) => ID)
  id: number

  @Field({ nullable: true })
  content: string

  @Field({ nullable: true })
  imageUrl: string

  @Field({ defaultValue: true })
  isPublic: boolean

  @Field()
  createdAt: Date

  @Field((_type) => UserType)
  author: User
}
