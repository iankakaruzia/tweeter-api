import { EntityRepository, Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { User } from '../entities/user.entity'
import { Provider } from 'src/auth/enums/provider.enum'
import { CreateUserByProviderParams } from 'src/auth/types/create-user-provider-params.type'
import { RegisterDto } from 'src/auth/dtos/register.dto'
import { UpdateProfileDto } from '../dtos/update-profile.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    registerDto: RegisterDto,
    hashedConfirmationToken: string
  ): Promise<User> {
    const { username, email, password } = registerDto
    const user = this.create()
    user.username = username
    user.email = email
    user.password = password
    user.confirmationToken = hashedConfirmationToken
    await this.save(user)
    return user
  }

  async getByUsernameOrEmail(usernameOrEmail: string) {
    return this.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    })
  }

  async getByResetPasswordToken(token: string) {
    return this.findOne({ resetPasswordToken: token })
  }

  async getByConfirmationToken(token: string) {
    return this.findOne({ confirmationToken: token })
  }

  async updateResetPasswordInfo(
    user: User,
    resetToken?: string,
    expirationDate?: number
  ) {
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiration = expirationDate
    await this.save(user)
  }

  async activateAccount(user: User) {
    user.isActive = true
    await this.save(user)
  }

  async updateUserPassword(user: User, password: string) {
    user.password = password
    user.resetPasswordExpiration = null
    user.resetPasswordToken = null
    await this.save(user)
  }

  async updateUserCoverPhoto(coverPhoto: string, user: User) {
    user.coverPhoto = coverPhoto
    return this.save(user)
  }

  async updateUserProfilePhoto(profilePhoto: string, user: User) {
    user.profilePhoto = profilePhoto
    return this.save(user)
  }

  async updateUserProfile(updateProfileDto: UpdateProfileDto, user: User) {
    Object.assign(user, updateProfileDto)
    return this.save(user)
  }

  async findUserByProvider(provider: Provider, providerId: string) {
    return this.findOne({ where: { provider, providerId } })
  }

  async createUserByProvider(
    params: CreateUserByProviderParams
  ): Promise<User> {
    const { provider, providerId, email, name, photoUrl } = params
    const user = this.create()
    user.username = nanoid(6)
    user.email = email
    user.name = name
    user.profilePhoto = photoUrl
    user.isActive = true
    user.provider = provider
    user.providerId = providerId
    await this.save(user)
    return user
  }

  async updateUsername(username: string, user: User) {
    user.username = username
    return this.save(user)
  }

  async updateCurrentPassword(password: string, user: User) {
    user.password = password
    return this.save(user)
  }
}
