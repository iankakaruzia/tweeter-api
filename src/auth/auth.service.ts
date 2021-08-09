import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes, createHash } from 'crypto'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { User } from 'src/users/entities/user.entity'
import { UserRepository } from 'src/users/repositories/user.repository'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { UpdateCurrentPasswordDto } from './dtos/update-current-password.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { LoginReturnType } from './types/logged-user.type'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async register(registerDto: RegisterDto, hashedConfirmationToken: string) {
    const { password } = registerDto
    const hashedPassword = await this.cryptographyService.hash(password)
    return this.userRepository.createUser(
      {
        ...registerDto,
        password: hashedPassword
      },
      hashedConfirmationToken
    )
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto
    const user = await this.userRepository.getByUsernameOrEmail(usernameOrEmail)
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
    const { cookie } = this.getCookieWithJwtToken(user)
    return {
      cookie,
      user
    }
  }

  async createPasswordResetToken(user: User) {
    const resetToken = randomBytes(32).toString('hex')
    const passwordResetToken = createHash('sha256')
      .update(resetToken)
      .digest('hex')
    const passwordResetExpiration = Date.now() + 24 * 60 * 60 * 1000 // 1 day
    await this.userRepository.updateResetPasswordInfo(
      user,
      passwordResetToken,
      passwordResetExpiration
    )
    return resetToken
  }

  async resetPasswordResetToken(user: User) {
    const passwordResetToken = undefined
    const passwordResetExpiration = undefined
    await this.userRepository.updateResetPasswordInfo(
      user,
      passwordResetToken,
      passwordResetExpiration
    )
  }

  async getUserByResetPasswordToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.userRepository.getByResetPasswordToken(hashedToken)
  }

  async getUserByConfirmationToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.userRepository.getByConfirmationToken(hashedToken)
  }

  async updateUserPassword(user: User, password: string) {
    const hashedPassword = await this.cryptographyService.hash(password)
    await this.userRepository.updateUserPassword(user, hashedPassword)
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
    return this.userRepository.updateCurrentPassword(hashedPassword, user)
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
      cookie
    }
  }

  logout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0'
  }

  getLoggedInUserInfo(user: User): LoginReturnType {
    return {
      user: {
        email: user.email,
        username: user.username,
        name: user?.name,
        profilePhoto: user?.profilePhoto
      }
    }
  }
}
