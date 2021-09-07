import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@ArgsType()
export class PaginationArgs {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  first: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  after: string

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  last: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  before: string
}
