import { EntityRepository, Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { RegisterInput } from 'src/auth/inputs/register.input'
import { User } from '../entities/user.entity'
import { UpdateProfileInput } from '../inputs/update-profile.input'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    registerInput: RegisterInput,
    hashedConfirmationToken: string
  ): Promise<User> {
    const { username, email, password } = registerInput

    const user = new User()
    user.id = nanoid()
    user.username = username
    user.email = email
    user.password = password
    user.isActive = false
    user.confirmationToken = hashedConfirmationToken

    await this.save(user)

    return user
  }

  async getByUsernameOrEmail(usernameOrEmail: string) {
    return this.findOne({
      where: {
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      }
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
    user.resetPasswordExpiration = undefined
    user.resetPasswordToken = undefined

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

    return this.save(user)
  }
}
