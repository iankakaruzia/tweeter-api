import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateTweetInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  content?: string

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isPublic?: boolean
}
