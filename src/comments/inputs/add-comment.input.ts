import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class AddCommentInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  content?: string

  @IsOptional()
  @Field(() => Int)
  tweetId: number
}
