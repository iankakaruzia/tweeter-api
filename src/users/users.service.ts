import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from 'src/auth/dtos/register.dto'
import { Provider } from 'src/auth/enums/provider.enum'
import { CreateUserByProviderParams } from 'src/auth/types/create-user-provider-params.type'
import { User } from './entities/user.entity'
import { UpdateProfileInput } from './inputs/update-profile.input'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(
    registerDto: RegisterDto,
    hashedConfirmationToken: string
  ): Promise<User> {
    return this.userRepository.createUser(registerDto, hashedConfirmationToken)
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

  async findUserByProvider(provider: Provider, providerId: string) {
    return this.userRepository.findUserByProvider(provider, providerId)
  }

  async createUserByProvider(params: CreateUserByProviderParams) {
    return this.userRepository.createUserByProvider(params)
  }

  async updateUsername(username: string, user: User) {
    return this.userRepository.updateUsername(username, user)
  }

  async updateCurrentPassword(password: string, user: User) {
    return this.userRepository.updateCurrentPassword(password, user)
  }
}
