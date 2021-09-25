import { UseGuards } from '@nestjs/common'
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { PaginationArgs } from 'src/common/pagination/models/pagination.args'
import { User as UserModel } from '@prisma/client'
import { PaginatedSaves } from './models/paginated-saves.type'
import { SaveType } from './models/save.type'
import { SavesService } from './saves.service'

@Resolver((_of: any) => SaveType)
export class SavesResolver {
  constructor(private savesService: SavesService) {}

  @Mutation((_returns) => SaveType)
  @UseGuards(GqlAuthGuard)
  async save(
    @Args('tweetId', { type: () => Int }) tweetId: number,
    @CurrentUser() user: UserModel
  ) {
    const result = await this.savesService.save(tweetId, user)

    console.log({ result })
    return result
  }

  @Mutation((_returns) => ID, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeSave(
    @Args('saveId', { type: () => Int }) saveId: number,
    @CurrentUser() user: UserModel
  ) {
    await this.savesService.removeSave(saveId, user)
    return null
  }

  @Query((_returns) => PaginatedSaves)
  @UseGuards(GqlAuthGuard)
  saves(
    @Args() paginationArgs: PaginationArgs,
    @CurrentUser() user: UserModel
  ) {
    return this.savesService.getSaves(paginationArgs, user)
  }
}
