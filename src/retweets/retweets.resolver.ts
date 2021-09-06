import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { RetweetType } from './models/retweet.type'
import { RetweetsService } from './retweets.service'

@Resolver((_of: any) => RetweetType)
export class RetweetsResolver {
  constructor(private retweetsService: RetweetsService) {}

  @Mutation((_returns) => RetweetType)
  @UseGuards(GqlAuthGuard)
  async retweet(
    @Args('tweetId', { type: () => ID }) tweetId: number,
    @CurrentUser() user: User
  ) {
    return this.retweetsService.retweet(tweetId, user)
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeRetweet(
    @Args('retweetId', { type: () => ID }) retweetId: number,
    @CurrentUser() user: User
  ) {
    await this.retweetsService.removeRetweet(retweetId, user)
    return null
  }
}
