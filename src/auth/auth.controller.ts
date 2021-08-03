import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { randomBytes, createHash } from 'crypto'

import { MailService } from 'src/mail/mail.service'
import { User } from 'src/users/entities/user.entity'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { LoginReturnType } from './types/logged-user.type'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService
  ) {}

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return HttpStatus.OK
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<LoginReturnType> {
    const user = req.user as User
    const { cookie, accessToken } = this.authService.getCookieWithJwtToken(user)

    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user, accessToken)
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return HttpStatus.OK
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: Request): Promise<LoginReturnType> {
    const user = req.user as User
    const { cookie, accessToken } = this.authService.getCookieWithJwtToken(user)

    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user, accessToken)
  }

  @Get('/twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin() {
    return HttpStatus.OK
  }

  @Get('/twitter/redirect')
  @UseGuards(AuthGuard('twitter'))
  async twitterLoginRedirect(@Req() req: Request): Promise<LoginReturnType> {
    const user = req.user as User
    const { cookie, accessToken } = this.authService.getCookieWithJwtToken(user)

    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user, accessToken)
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    return HttpStatus.OK
  }

  @Get('/github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubLoginRedirect(@Req() req: Request): Promise<LoginReturnType> {
    const user = req.user as User
    const { cookie, accessToken } = this.authService.getCookieWithJwtToken(user)

    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user, accessToken)
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request
  ): Promise<LoginReturnType> {
    const { accessToken, cookie, user } = await this.authService.login(loginDto)
    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user, accessToken)
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const confirmationToken = randomBytes(32).toString('hex')

    const hashedConfirmationToken = createHash('sha256')
      .update(confirmationToken)
      .digest('hex')

    const user = await this.authService.register(
      registerDto,
      hashedConfirmationToken
    )

    await this.mailService.sendConfirmationEmail(user, confirmationToken)

    return {
      message: `Almost there! We've sent an email to ${user.email}. Open it up to activate your account.`
    }
  }

  @Post('/confirm-account/:token')
  async confirmAccount(@Param('token') token: string) {
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
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
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
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
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
  }
}
