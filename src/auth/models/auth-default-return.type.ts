import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthDefaultReturn')
export class AuthDefaultReturnType {
  @Field()
  message: string
}
