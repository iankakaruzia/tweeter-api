import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterCredentialsDto } from 'src/auth/dtos/register-credentials.dto'
import { User } from './entities/user.entity'
import { UpdateProfileInput } from './inputs/update-profile.input'
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

  async updateUserProfile(updateProfileInput: UpdateProfileInput, user: User) {
    if (updateProfileInput?.bio) {
      user.bio = updateProfileInput.bio
    }

    if (updateProfileInput?.name) {
      user.name = updateProfileInput.name
    }
    return this.userRepository.save(user)
  }

  async updateUserProfilePhoto(profilePhoto: string, user: User) {
    user.profilePhoto = profilePhoto

    return this.userRepository.save(user)
  }

  async updateUserCoverPhoto(coverPhoto: string, user: User) {
    user.coverPhoto = coverPhoto

    return this.userRepository.save(user)
  }
}
