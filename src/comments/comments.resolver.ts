import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { CommentsService } from './comments.service'
import { AddCommentInput } from './inputs/add-comment.input'
import { CommentType } from './models/comment.type'

@Resolver((_of: any) => CommentType)
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Mutation((_returns) => CommentType)
  @UseGuards(GqlAuthGuard)
  async addComment(
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
    @Args('addCommentInput')
    addCommentInput: AddCommentInput,
    @CurrentUser() user: User
  ) {
    return this.commentsService.addComment(image, addCommentInput, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeComment(
    @Args('commentId', { type: () => ID }) commentId: number,
    @CurrentUser() user: User
  ) {
    await this.commentsService.removeComment(commentId, user)
    return null
  }
}
