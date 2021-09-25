import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { User as UserModel } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
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
}
