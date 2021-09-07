import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { LikesService } from './likes.service'
import { LikeType } from './models/like.type'

@Resolver((_of: any) => LikeType)
export class LikesResolver {
  constructor(private likesService: LikesService) {}

  @Mutation((_returns) => LikeType)
  @UseGuards(GqlAuthGuard)
  async likeTweet(
    @Args('tweetId', { type: () => ID }) tweetId: number,
    @CurrentUser() user: User
  ) {
    return this.likesService.likeTweet(tweetId, user)
  }

  @Mutation((_returns) => LikeType)
  @UseGuards(GqlAuthGuard)
  async likeComment(
    @Args('commentId', { type: () => ID }) commentId: number,
    @CurrentUser() user: User
  ) {
    return this.likesService.likeComment(commentId, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async dislike(
    @Args('likeId', { type: () => ID }) likeId: number,
    @CurrentUser() user: User
  ) {
    await this.likesService.dislike(likeId, user)
    return null
  }
}
