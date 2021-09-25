import { UseGuards } from '@nestjs/common'
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User as UserModel } from '@prisma/client'
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
    @CurrentUser() user: UserModel
  ) {
    return this.commentsService.addComment(image, addCommentInput, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeComment(
    @Args('commentId', { type: () => Int }) commentId: number,
    @CurrentUser() user: UserModel
  ) {
    await this.commentsService.removeComment(commentId, user)
    return null
  }
}
