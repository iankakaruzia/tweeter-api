import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterInput } from 'src/auth/inputs/register.input'
import { User } from './entities/user.entity'
import { UpdateProfileInput } from './inputs/update-profile.input'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(
    registerInput: RegisterInput,
    hashedConfirmationToken: string
  ): Promise<User> {
    return this.userRepository.createUser(
      registerInput,
      hashedConfirmationToken
    )
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.userRepository.getByUsernameOrEmail(usernameOrEmail)
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
    return this.userRepository.updateUserProfile(updateProfileInput, user)
  }

  async updateUserProfilePhoto(profilePhoto: string, user: User) {
    return this.userRepository.updateUserProfilePhoto(profilePhoto, user)
  }

  async updateUserCoverPhoto(coverPhoto: string, user: User) {
    return this.userRepository.updateUserCoverPhoto(coverPhoto, user)
  }

  async updateUserPassword(user: User, password: string) {
    await this.userRepository.updateUserPassword(user, password)
  }

  async activateAccount(user: User) {
    await this.userRepository.activateAccount(user)
  }
}
