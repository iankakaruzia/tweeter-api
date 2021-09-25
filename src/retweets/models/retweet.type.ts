import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TweetType } from 'src/tweets/models/tweet.type'
import { User as UserModel, Tweet as TweetModel } from '@prisma/client'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Retweet')
export class RetweetType {
  @Field((_type) => ID)
  id: number

  @Field((_type) => UserType)
  author: UserModel

  @Field((_type) => TweetType)
  tweet: TweetModel

  @Field()
  createdAt: Date
}
