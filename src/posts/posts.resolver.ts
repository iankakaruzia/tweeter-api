import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { CreatePostInput } from './inputs/create-post.input'
import { PostType } from './models/post.type'
import { PostsService } from './posts.service'

@Resolver((_of: any) => PostType)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((_returns) => PostType)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
    @Args('createPostInput', { nullable: true })
    createPostInput: CreatePostInput,
    @CurrentUser() user: User
  ) {
    return this.postsService.createPost(image, createPostInput, user)
  }

  @Query((_returns) => PostType)
  async post(@Args('id', { type: () => ID }) id: number) {
    return this.postsService.getPost(id)
  }
}
