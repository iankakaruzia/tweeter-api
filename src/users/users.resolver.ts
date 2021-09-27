import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User as UserModel } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import {
  FollowersType,
  FollowingType,
  SingleFollowType
} from './models/follow.type'
import { UserType } from './models/user.type'
import { UsersService } from './users.service'

@Resolver((_of: any) => UserType)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: UserModel) {
    return this.usersService.sanityzeUser(user)
  }

  @Mutation((_returns) => SingleFollowType)
  @UseGuards(GqlAuthGuard)
  async follow(
    @Args('userFollowedId', { type: () => Int }) userFollowedId: number,
    @CurrentUser() user: UserModel
  ) {
    return this.usersService.follow(userFollowedId, user)
  }

  @Mutation((_returns) => String)
  @UseGuards(GqlAuthGuard)
  async unfollow(
    @Args('userUnfollowedId', { type: () => Int }) userUnfollowedId: number,
    @CurrentUser() user: UserModel
  ) {
    await this.usersService.unfollow(userUnfollowedId, user)
    return 'SUCCESS'
  }

  @Query((_returns) => FollowingType)
  @UseGuards(GqlAuthGuard)
  async following(@CurrentUser() user: UserModel) {
    return this.usersService.following(user)
  }

  @Query((_returns) => FollowersType)
  @UseGuards(GqlAuthGuard)
  async followers(@CurrentUser() user: UserModel) {
    return this.usersService.followers(user)
  }
}
