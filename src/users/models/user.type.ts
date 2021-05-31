import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('User')
export class UserType {
  @Field((_type) => ID)
  id: string

  @Field({ nullable: true })
  name: string

  @Field()
  email: string

  @Field()
  username: string

  @Field({ nullable: true })
  bio: string

  @Field({ nullable: true })
  profilePhoto: string

  @Field({ nullable: true })
  coverPhoto: string

  @Field({ nullable: true })
  phone: string

  @Field({ nullable: true })
  birthday: Date
}
