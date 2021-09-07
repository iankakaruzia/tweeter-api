import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class AddCommentInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  content?: string

  @IsOptional()
  @Field(() => ID)
  tweetId: number
}
