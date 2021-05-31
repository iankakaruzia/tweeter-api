import { Field, InputType } from '@nestjs/graphql'
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { IsValidAge } from 'src/common/decorators/is-valid-age.decorator'

@InputType()
export class UpdateProfileInput {
  @IsString()
  @MinLength(2)
  @IsOptional()
  @Field({ nullable: true })
  name: string

  @IsString()
  @MinLength(10)
  @IsOptional()
  @Field({ nullable: true })
  bio: string

  @IsString()
  @MinLength(7)
  @MaxLength(15)
  @IsOptional()
  @Field({ nullable: true })
  phone: string

  @IsDate()
  @IsValidAge()
  @IsOptional()
  @Field({ nullable: true })
  birthday: Date
}
