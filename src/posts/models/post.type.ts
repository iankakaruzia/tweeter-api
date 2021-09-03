import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('Post')
export class PostType {
  @Field((_type) => ID)
  id: number

  @Field({ nullable: true })
  content: string

  @Field({ nullable: true })
  imageUrl: string

  @Field({ defaultValue: true })
  isPublic: boolean

  @Field()
  createdAt: Date
}
