import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, MinLength } from 'class-validator'

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
}
