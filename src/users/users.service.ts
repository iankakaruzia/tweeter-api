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
    registerCredentialsDto: RegisterCredentialsDto,
    hashedConfirmationToken: string
  ): Promise<User> {
    return this.userRepository.createUser(
      registerCredentialsDto,
      hashedConfirmationToken
    )
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.userRepository.getByUsernameOrEmail(usernameOrEmail)
  }

  async getUserEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email)
  }

  async getUserByResetPasswordToken(token: string): Promise<User> {
    return this.userRepository.getByResetPasswordToken(token)
  }

  async getUserByConfirmationToken(token: string): Promise<User> {
    return this.userRepository.getByConfirmationToken(token)
  }

  async updateResetPasswordInfo(
    user: User,
    resetToken?: string,
    expirationDate?: number
  ): Promise<void> {
    await this.userRepository.updateResetPasswordInfo(
      user,
      resetToken,
      expirationDate
    )
  }

  async updateUserProfile(updateProfileInput: UpdateProfileInput, user: User) {
    if (updateProfileInput?.bio) {
      user.bio = updateProfileInput.bio
    }

    if (updateProfileInput?.name) {
      user.name = updateProfileInput.name
    }

    if (updateProfileInput?.phone) {
      user.phone = updateProfileInput.phone
    }

    if (updateProfileInput?.birthday) {
      user.birthday = updateProfileInput.birthday
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

  async updateUserPassword(user: User, password: string) {
    user.password = password
    user.resetPasswordExpiration = undefined
    user.resetPasswordToken = undefined

    await this.userRepository.save(user)
  }

  async activateAccount(user: User) {
    user.isActive = true

    await this.userRepository.save(user)
  }
}
