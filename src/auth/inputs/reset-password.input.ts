import { Field, InputType } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { IsEqualTo } from 'src/common/decorators/is-equal-to.decorator'

@InputType()
export class ResetPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  token: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  @Field()
  password: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!'
  })
  @IsEqualTo('password')
  @Field()
  passwordConfirmation: string
}
