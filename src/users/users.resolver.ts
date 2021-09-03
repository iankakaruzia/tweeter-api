import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { User } from './entities/user.entity'
import { UserType } from './models/user.type'
import { UserRepository } from './repositories/user.repository'

@Resolver((_of: any) => UserType)
export class UsersResolver {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  @Query((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user
  }
}
