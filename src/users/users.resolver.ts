import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from './entities/user.entity'
import { UserType } from './models/user.type'

@Resolver((_of: any) => UserType)
export class UsersResolver {
  @Query((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user
  }
}
