import { Field, ObjectType } from '@nestjs/graphql'
import { UserType } from 'src/users/models/user.type'

@ObjectType('AuthenticatedUser')
export class AuthenticatedUserType {
  @Field()
  accessToken: string

  @Field((_type) => UserType)
  user: UserType
}
