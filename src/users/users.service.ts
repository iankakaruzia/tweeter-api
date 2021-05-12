import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterCredentialsDto } from 'src/auth/dtos/register-credentials.dto'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<User> {
    return this.userRepository.createUser(registerCredentialsDto)
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.userRepository.getByUsernameOrEmail(usernameOrEmail)
  }
}
