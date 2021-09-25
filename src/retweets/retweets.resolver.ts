import { UseGuards } from '@nestjs/common'
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User as UserModel } from '@prisma/client'
import { RetweetType } from './models/retweet.type'
import { RetweetsService } from './retweets.service'

@Resolver((_of: any) => RetweetType)
export class RetweetsResolver {
  constructor(private retweetsService: RetweetsService) {}

  @Mutation((_returns) => RetweetType)
  @UseGuards(GqlAuthGuard)
  async retweet(
    @Args('tweetId', { type: () => Int }) tweetId: number,
    @CurrentUser() user: UserModel
  ) {
    return this.retweetsService.retweet(tweetId, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeRetweet(
    @Args('retweetId', { type: () => Int }) retweetId: number,
    @CurrentUser() user: UserModel
  ) {
    await this.retweetsService.removeRetweet(retweetId, user)
    return null
  }
}
