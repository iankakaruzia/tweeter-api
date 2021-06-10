import { Field, InputType } from '@nestjs/graphql'
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'

@InputType()
export class RegisterInput {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Field()
  username: string

  @IsEmail()
  @Field()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  @Field()
  password: string
}
