import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomBytes, createHash } from 'crypto'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { LoginCredentialsDto } from './dtos/login-credentials.dto'
import { RegisterCredentialsDto } from './dtos/register-credentials.dto'
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

  async register(registerCredentialsDto: RegisterCredentialsDto) {
    const { password } = registerCredentialsDto
    const hashedPassword = await this.cryptographyService.hash(password)
    const user = await this.usersService.createUser({
      ...registerCredentialsDto,
      password: hashedPassword
    })

    return this.getAccessToken(user)
  }

  async login(loginCredentialsDto: LoginCredentialsDto) {
    const { usernameOrEmail, password } = loginCredentialsDto
    const user = await this.usersService.getUserByUsernameOrEmail(
      usernameOrEmail
    )

    if (!user) {
      throw new UnauthorizedException('Invalid crendentials')
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

  async updateUserPassword(user: User, password: string) {
    const hashedPassword = await this.cryptographyService.hash(password)
    await this.usersService.updateUserPassword(user, hashedPassword)
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
