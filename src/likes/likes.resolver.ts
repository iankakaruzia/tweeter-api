import { UseGuards } from '@nestjs/common'
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User as UserModel } from '@prisma/client'
import { LikesService } from './likes.service'
import { LikeType } from './models/like.type'

@Resolver((_of: any) => LikeType)
export class LikesResolver {
  constructor(private likesService: LikesService) {}

  @Mutation((_returns) => LikeType)
  @UseGuards(GqlAuthGuard)
  async likeTweet(
    @Args('tweetId', { type: () => Int }) tweetId: number,
    @CurrentUser() user: UserModel
  ) {
    return this.likesService.likeTweet(tweetId, user)
  }

  @Mutation((_returns) => LikeType)
  @UseGuards(GqlAuthGuard)
  async likeComment(
    @Args('commentId', { type: () => Int }) commentId: number,
    @CurrentUser() user: UserModel
  ) {
    return this.likesService.likeComment(commentId, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async dislike(
    @Args('likeId', { type: () => Int }) likeId: number,
    @CurrentUser() user: UserModel
  ) {
    await this.likesService.dislike(likeId, user)
    return null
  }
}
