import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Tweet } from 'src/tweets/entities/tweet.entity'
import { TweetType } from 'src/tweets/models/tweet.type'
import { User } from 'src/users/entities/user.entity'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Retweet')
export class RetweetType {
  @Field((_type) => ID)
  id: number

  @Field((_type) => UserType)
  author: User

  @Field((_type) => TweetType)
  tweet: Tweet

  @Field()
  createdAt: Date
}
