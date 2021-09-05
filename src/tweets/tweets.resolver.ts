import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from 'src/users/entities/user.entity'
import { CreateTweetInput } from './inputs/create-tweet.input'
import { TweetType } from './models/tweet.type'
import { TweetsService } from './tweets.service'

@Resolver((_of: any) => TweetType)
export class TweetsResolver {
  constructor(private tweetsService: TweetsService) {}

  @Mutation((_returns) => TweetType)
  @UseGuards(GqlAuthGuard)
  async createTweet(
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
    @Args('createTweetInput', { nullable: true })
    createTweetInput: CreateTweetInput,
    @CurrentUser() user: User
  ) {
    return this.tweetsService.createTweet(image, createTweetInput, user)
  }

  @Query((_returns) => TweetType)
  async tweet(@Args('id', { type: () => ID }) id: number) {
    return this.tweetsService.getTweet(id)
  }
}
