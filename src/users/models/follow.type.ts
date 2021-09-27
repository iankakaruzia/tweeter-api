import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('Followers')
export class FollowersType {
  @Field((_type) => Int)
  count: number

  @Field((_type) => [SingleFollowType])
  followers: SingleFollowType[]
}

@ObjectType('Following')
export class FollowingType {
  @Field((_type) => Int)
  count: number

  @Field((_type) => [SingleFollowType])
  following: SingleFollowType[]
}

@ObjectType('SingleFollow')
export class SingleFollowType {
  @Field((_type) => Int)
  id: number

  @Field({ nullable: true })
  name: string

  @Field()
  username: string

  @Field({ nullable: true })
  profilePhoto: string

  @Field({ nullable: true })
  createdAt: Date
}
