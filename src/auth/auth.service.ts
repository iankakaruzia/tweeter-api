import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomBytes, createHash } from 'crypto'
import { nanoid } from 'nanoid'
import { User as UserModel, Provider } from '@prisma/client'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { UpdateCurrentPasswordDto } from './dtos/update-current-password.dto'
import { UpdateEmailDto } from './dtos/update-email.dto'
import { UpdateUsernameDto } from './dtos/update-username.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { LoginReturnType } from './types/logged-user.type'
import { CreateUserByProviderParams } from './types/create-user-provider-params.type'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

  async register(registerDto: RegisterDto): Promise<UserModel> {
    const confirmationToken = randomBytes(32).toString('hex')
    const hashedConfirmationToken = createHash('sha256')
      .update(confirmationToken)
      .digest('hex')
    const { password, username, email } = registerDto
    const hashedPassword = await this.cryptographyService.hash(password)
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        confirmationToken: hashedConfirmationToken
      }
    })
    await this.mailService.sendConfirmationEmail(user, confirmationToken)
    return user
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<UserModel> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
      }
    })
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto
    const user = await this.getUserByUsernameOrEmail(usernameOrEmail)
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

  async createPasswordResetToken(user: UserModel): Promise<string> {
    const resetToken = randomBytes(32).toString('hex')
    const passwordResetToken = createHash('sha256')
      .update(resetToken)
      .digest('hex')
    const passwordResetExpiration = Date.now() + 24 * 60 * 60 * 1000 // 1 day
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        resetPasswordToken: passwordResetToken,
        resetPasswordExpiration: passwordResetExpiration
      }
    })
    return resetToken
  }

  async resetPasswordResetToken(user: UserModel): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpiration: null
      }
    })
  }

  async getUserByResetPasswordToken(token: string): Promise<UserModel> {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken
      }
    })
  }

  async getUserByConfirmationToken(token: string): Promise<UserModel> {
    const hashedToken = createHash('sha256').update(token).digest('hex')
    return this.prisma.user.findFirst({
      where: {
        confirmationToken: hashedToken
      }
    })
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
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordExpiration: null,
        resetPasswordToken: null
      }
    })
  }

  async updateCurrentPassword(
    updateCurrentPasswordDto: UpdateCurrentPasswordDto,
    user: UserModel
  ): Promise<UserModel> {
    const { currentPassword, password } = updateCurrentPasswordDto
    const isValidPassword = await this.cryptographyService.compare(
      currentPassword,
      user.password
    )
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid crendentials')
    }
    const hashedPassword = await this.cryptographyService.hash(password)
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })
  }

  getAccessToken(user: UserModel) {
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

  getCookieWithJwtToken(user: UserModel): { cookie: string } {
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

  getLoggedInUserInfo(user: UserModel): LoginReturnType {
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
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isActive: true
      }
    })
    await this.mailService.sendSuccessfullConfirmationEmail(user)
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto
    const user = await this.getUserByUsernameOrEmail(email)
    if (user) {
      const resetToken = await this.createPasswordResetToken(user)
      await this.mailService.sendForgotPasswordEmail(user, resetToken)
    }
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto, user: UserModel) {
    const { username } = updateUsernameDto
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        username
      }
    })
    const { cookie } = this.getCookieWithJwtToken(updatedUser)
    return {
      cookie,
      loggedInUserInfo: this.getLoggedInUserInfo(updatedUser)
    }
  }

  async updateEmail(updateEmailDto: UpdateEmailDto, user: UserModel) {
    const { email } = updateEmailDto
    if (user.provider) {
      throw new BadRequestException(
        'Unable to update email from account created with a social login'
      )
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email
      }
    })
    await this.mailService.sendEmailUpdatedEmail(user, email)
    const { cookie } = this.getCookieWithJwtToken(updatedUser)
    return {
      cookie,
      loggedInUserInfo: this.getLoggedInUserInfo(updatedUser)
    }
  }

  async getUserByProvider(providerId: string, provider: Provider) {
    return this.prisma.user.findFirst({
      where: {
        providerId,
        provider
      }
    })
  }

  async createUserByProvider(params: CreateUserByProviderParams) {
    const { provider, providerId, email, name, photoUrl } = params
    return this.prisma.user.create({
      data: {
        email,
        name,
        username: nanoid(6),
        profilePhoto: photoUrl,
        isActive: true,
        provider,
        providerId
      }
    })
  }
}
