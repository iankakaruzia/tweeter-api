import { RegisterCredentialsDto } from 'src/auth/dtos/register-credentials.dto'
import { EntityRepository, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { User } from '../entities/user.entity'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    registerCredentialsDto: RegisterCredentialsDto,
    hashedConfirmationToken: string
  ): Promise<User> {
    const { username, email, password } = registerCredentialsDto

    const user = new User()
    user.id = uuid()
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

  async getByEmail(email: string) {
    return this.findOne({ email })
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
}
