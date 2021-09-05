import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Post } from 'src/posts/entities/post.entity'
import { PostType } from 'src/posts/models/post.type'
import { User } from 'src/users/entities/user.entity'
import { UserType } from 'src/users/models/user.type'

@ObjectType('Like')
export class LikeType {
  @Field((_type) => ID)
  id: number

  @Field((_type) => UserType)
  author: User

  @Field((_type) => PostType)
  post: Post

  @Field()
  createdAt: Date
}
