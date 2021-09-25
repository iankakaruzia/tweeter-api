import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User as UserModel } from '@prisma/client'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Tweet')
export class TweetType {
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
  author: UserModel
}
