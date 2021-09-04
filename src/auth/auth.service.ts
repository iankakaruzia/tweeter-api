import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes, createHash } from 'crypto'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { MailService } from 'src/mail/mail.service'
import { User } from 'src/users/entities/user.entity'
import { UserRepository } from 'src/users/repositories/user.repository'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { UpdateCurrentPasswordDto } from './dtos/update-current-password.dto'
import { UpdateUsernameDto } from './dtos/update-username.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { LoginReturnType } from './types/logged-user.type'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const confirmationToken = randomBytes(32).toString('hex')
    const hashedConfirmationToken = createHash('sha256')
      .update(confirmationToken)
      .digest('hex')
    const { password } = registerDto
    const hashedPassword = await this.cryptographyService.hash(password)
    const user = await this.userRepository.createUser(
      {
        ...registerDto,
        password: hashedPassword
      },
      hashedConfirmationToken
    )
    await this.mailService.sendConfirmationEmail(user, confirmationToken)
    return user
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

  async createPasswordResetToken(user: User): Promise<string> {
    console.log('HERE')
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

  async resetPasswordResetToken(user: User): Promise<void> {
    const passwordResetToken = undefined
    const passwordResetExpiration = undefined
    await this.userRepository.updateResetPasswordInfo(
      user,
      passwordResetToken,
      passwordResetExpiration
    )
  }

  async getUserByResetPasswordToken(token: string): Promise<User> {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.userRepository.getByResetPasswordToken(hashedToken)
  }

  async getUserByConfirmationToken(token: string): Promise<User> {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.userRepository.getByConfirmationToken(hashedToken)
  }

  async updateUserPassword(
    resetPasswordDto: ResetPasswordDto,
    token: string
  ): Promise<void> {
    const { password } = resetPasswordDto
    const user = await this.getUserByResetPasswordToken(token)
    const isValidToken = Date.now() <= user?.resetPasswordExpiration
    if (!user || !isValidToken) {
      throw new NotFoundException(
        'Invalid reset token! Please request a new token again.'
      )
    }
    const hashedPassword = await this.cryptographyService.hash(password)
    await this.userRepository.updateUserPassword(user, hashedPassword)
  }

  async updateCurrentPassword(
    updateCurrentPasswordDto: UpdateCurrentPasswordDto,
    user: User
  ): Promise<User> {
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

  getCookieWithJwtToken(user: User): { cookie: string } {
    const payload: JwtPayload = { username: user.username }
    const accessToken = this.jwtService.sign(payload)
    const cookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRES_IN'
    )}`
    return {
      cookie
    }
  }

  logout(): string {
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

  async confirmAccount(token: string): Promise<void> {
    const user = await this.getUserByConfirmationToken(token)
    if (user?.isActive) {
      throw new BadRequestException('Account Already Activated!')
    }
    if (!user) {
      throw new NotFoundException('Invalid confirmation token!')
    }
    await this.userRepository.activateAccount(user)
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto
    const user = await this.userRepository.getByUsernameOrEmail(email)
    if (user) {
      const resetToken = await this.createPasswordResetToken(user)
      await this.mailService.sendForgotPasswordEmail(user, resetToken)
    }
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto, user: User) {
    const { username } = updateUsernameDto
    const updatedUser = await this.userRepository.updateUsername(username, user)
    const { cookie } = this.getCookieWithJwtToken(updatedUser)
    return {
      cookie,
      loggedInUserInfo: this.getLoggedInUserInfo(updatedUser)
    }
  }
}
