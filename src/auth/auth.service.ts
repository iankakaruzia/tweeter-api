import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomBytes, createHash } from 'crypto'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { LoginInput } from './inputs/login.input'
import { RegisterInput } from './inputs/register.input'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string) {
    return this.usersService.getUserByUsernameOrEmail(username)
  }

  async register(
    registerInput: RegisterInput,
    hashedConfirmationToken: string
  ) {
    const { password } = registerInput
    const hashedPassword = await this.cryptographyService.hash(password)
    return this.usersService.createUser(
      {
        ...registerInput,
        password: hashedPassword
      },
      hashedConfirmationToken
    )
  }

  async login(loginInput: LoginInput) {
    const { usernameOrEmail, password } = loginInput
    const user = await this.usersService.getUserByUsernameOrEmail(
      usernameOrEmail
    )

    if (!user) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account must be verified before you can log in.'
      )
    }

    const isValidPassword = await this.cryptographyService.compare(
      password,
      user.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    return this.getAccessToken(user)
  }

  async checkUser(email: string) {
    return this.usersService.getUserEmail(email)
  }

  async createPasswordResetToken(user: User) {
    const resetToken = randomBytes(32).toString('hex')

    const passwordResetToken = createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const passwordResetExpiration = Date.now() + 24 * 60 * 60 * 1000 // 1 day

    await this.usersService.updateResetPasswordInfo(
      user,
      passwordResetToken,
      passwordResetExpiration
    )

    return resetToken
  }

  async resetPasswordResetToken(user: User) {
    const passwordResetToken = undefined
    const passwordResetExpiration = undefined
    await this.usersService.updateResetPasswordInfo(
      user,
      passwordResetToken,
      passwordResetExpiration
    )
  }

  async getUserByResetPasswordToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex')

    return this.usersService.getUserByResetPasswordToken(hashedToken)
  }

  async getUserByConfirmationToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex')

    return this.usersService.getUserByConfirmationToken(hashedToken)
  }

  async updateUserPassword(user: User, password: string) {
    const hashedPassword = await this.cryptographyService.hash(password)
    await this.usersService.updateUserPassword(user, hashedPassword)
  }

  async activateAccount(user: User) {
    await this.usersService.activateAccount(user)
  }

  private getAccessToken(user: User) {
    const payload: JwtPayload = { username: user.username }

    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        name: user.name || '',
        email: user.email,
        username: user.username,
        profilePhoto: user.profilePhoto || '',
        coverPhoto: user.coverPhoto || ''
      }
    }
  }
}
