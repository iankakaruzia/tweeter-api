import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User as UserModel } from '@prisma/client'
import { Tweet as TweetModel } from '@prisma/client'
import { TweetType } from 'src/tweets/models/tweet.type'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Comment')
export class CommentType {
  @Field((_type) => ID)
  id: number

  @Field({ nullable: true })
  content: string

  @Field({ nullable: true })
  imageUrl: string

  @Field((_type) => UserType)
  author: UserModel

  @Field((_type) => TweetType)
  tweet: TweetModel

  @Field({ nullable: true })
  likesCount: number

  @Field()
  createdAt: Date
}
