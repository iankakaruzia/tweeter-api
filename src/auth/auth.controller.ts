import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { randomBytes, createHash } from 'crypto'
import { MailService } from 'src/mail/mail.service'
import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { LoginCredentialsDto } from './dtos/login-credentials.dto'
import { RegisterCredentialsDto } from './dtos/register-credentials.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    try {
      const confirmationToken = randomBytes(32).toString('hex')

      const hashedConfirmationToken = createHash('sha256')
        .update(confirmationToken)
        .digest('hex')

      const user = await this.authService.register(
        registerCredentialsDto,
        hashedConfirmationToken
      )

      await this.mailService.sendConfirmationEmail(user, confirmationToken)

      return {
        message: `Almost there! We've sent an email to ${user.email}. Open it up to activate your account.`
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    try {
      return await this.authService.login(loginCredentialsDto)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto
      const user = await this.authService.checkUser(email)

      if (!user) {
        throw new BadRequestException()
      }

      const resetToken = await this.authService.createPasswordResetToken(user)

      await this.mailService.sendForgotPasswordEmail(user, resetToken)

      return {
        message: 'Token sent to email!'
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    try {
      const { password } = resetPasswordDto
      const user = await this.authService.getUserByResetPasswordToken(token)

      const isValidToken = Date.now() <= user?.resetPasswordExpiration

      if (!user || !isValidToken) {
        throw new NotFoundException(
          'Invalid reset token! Please request a new token again.'
        )
      }

      await this.authService.updateUserPassword(user, password)

      return {
        message: 'Password updated! Please log in to enjoy our platform.'
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Post('/confirmation/:token')
  async confirmation(@Param('token') token: string) {
    try {
      const user = await this.authService.getUserByConfirmationToken(token)

      if (!user) {
        throw new NotFoundException('Invalid confirmation token!')
      }

      if (user.isActive) {
        throw new BadRequestException('Account Already Activated!')
      }

      await this.authService.activateAccount(user)

      return {
        message: 'Account Successfully Activated!'
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
