import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomBytes, createHash } from 'crypto'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { UpdateCurrentPasswordDto } from './dtos/update-current-password.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { LoginReturnType } from './types/logged-user.type'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto, hashedConfirmationToken: string) {
    const { password } = registerDto
    const hashedPassword = await this.cryptographyService.hash(password)
    return this.usersService.createUser(
      {
        ...registerDto,
        password: hashedPassword
      },
      hashedConfirmationToken
    )
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto
    const user = await this.usersService.getUserByUsernameOrEmail(
      usernameOrEmail
    )

    if (!user) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    if (user.provider) {
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

    const { cookie, accessToken } = this.getCookieWithJwtToken(user)
    return {
      cookie,
      accessToken,
      user
    }
  }

  async checkUser(email: string) {
    return this.usersService.getUserByUsernameOrEmail(email)
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

  async updateUsername(username: string, user: User) {
    return this.usersService.updateUsername(username, user)
  }

  async updateCurrentPassword(
    updateCurrentPasswordDto: UpdateCurrentPasswordDto,
    user: User
  ) {
    const { currentPassword, password } = updateCurrentPasswordDto

    const isValidPassword = await this.cryptographyService.compare(
      currentPassword,
      user.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    const hashedPassword = await this.cryptographyService.hash(password)
    return this.usersService.updateCurrentPassword(hashedPassword, user)
  }

  getAccessToken(user: User) {
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

  getCookieWithJwtToken(user: User) {
    const payload: JwtPayload = { username: user.username }

    const accessToken = this.jwtService.sign(payload)
    const cookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN'
    )}`
    return {
      cookie,
      accessToken
    }
  }

  logout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0'
  }

  getLoggedInUserInfo(user: User, accessToken: string): LoginReturnType {
    return {
      accessToken,
      user: {
        email: user.email,
        username: user.username,
        name: user?.name,
        profilePhoto: user?.profilePhoto
      }
    }
  }
}
