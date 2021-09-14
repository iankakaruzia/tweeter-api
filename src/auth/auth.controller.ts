import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'

import { User } from 'src/users/entities/user.entity'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { LoginReturnType } from './types/logged-user.type'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { GetUser } from './decorators/get-user.decorator'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UpdateUsernameDto } from './dtos/update-username.dto'
import { UpdateCurrentPasswordDto } from './dtos/update-current-password.dto'
import { TwitterGuard } from './guards/twitter.guard'
import { GoogleGuard } from './guards/google.guard'
import { AuthHttpExceptionFilter } from './filters/auth-http-exception.filter'
import { FacebookGuard } from './guards/facebook.guard'
import { GithubGuard } from './guards/github.guard'
import { ConfigService } from '@nestjs/config'

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Get('/facebook')
  @UseGuards(new FacebookGuard())
  async facebookLogin() {
    return HttpStatus.OK
  }

  @Get('/facebook/redirect')
  @UseGuards(new FacebookGuard())
  @UseFilters(new AuthHttpExceptionFilter())
  async facebookLoginRedirect(@Req() req: Request, @GetUser() user: User) {
    const { cookie } = this.authService.getCookieWithJwtToken(user)
    const redirectUrl = this.configService.get<string>(
      'SOCIAL_LOGIN_REDIRECT_URL'
    )
    req.res.setHeader('Set-Cookie', cookie)
    req.res.redirect(`${redirectUrl}?status=success`)
  }

  @Get('/google')
  @UseGuards(new GoogleGuard())
  async googleLogin() {
    return HttpStatus.OK
  }

  @Get('/google/redirect')
  @UseGuards(new GoogleGuard())
  @UseFilters(new AuthHttpExceptionFilter())
  async googleLoginRedirect(@Req() req: Request, @GetUser() user: User) {
    const { cookie } = this.authService.getCookieWithJwtToken(user)
    const redirectUrl = this.configService.get<string>(
      'SOCIAL_LOGIN_REDIRECT_URL'
    )
    req.res.setHeader('Set-Cookie', cookie)
    req.res.redirect(`${redirectUrl}?status=success`)
  }

  @Get('/twitter')
  @UseGuards(new TwitterGuard())
  async twitterLogin() {
    return HttpStatus.OK
  }

  @Get('/twitter/redirect')
  @UseGuards(new TwitterGuard())
  @UseFilters(new AuthHttpExceptionFilter())
  async twitterLoginRedirect(@Req() req: Request, @GetUser() user: User) {
    const { cookie } = this.authService.getCookieWithJwtToken(user)
    const redirectUrl = this.configService.get<string>(
      'SOCIAL_LOGIN_REDIRECT_URL'
    )
    req.res.setHeader('Set-Cookie', cookie)
    req.res.redirect(`${redirectUrl}?status=success`)
  }

  @Get('/github')
  @UseGuards(new GithubGuard())
  async githubLogin() {
    return HttpStatus.OK
  }

  @Get('/github/redirect')
  @UseGuards(new GithubGuard())
  @UseFilters(new AuthHttpExceptionFilter())
  async githubLoginRedirect(@Req() req: Request, @GetUser() user: User) {
    const { cookie } = this.authService.getCookieWithJwtToken(user)
    const redirectUrl = this.configService.get<string>(
      'SOCIAL_LOGIN_REDIRECT_URL'
    )
    req.res.setHeader('Set-Cookie', cookie)
    req.res.redirect(`${redirectUrl}?status=success`)
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request
  ): Promise<LoginReturnType> {
    const { cookie, user } = await this.authService.login(loginDto)
    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user)
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto)
    return {
      message: `Almost there! We've sent an email to ${user.email}. Open it up to activate your account.`
    }
  }

  @Post('/confirm-account/:token')
  async confirmAccount(@Param('token') token: string) {
    await this.authService.confirmAccount(token)
    return {
      message:
        'Account Successfully Activated! You can now log into our application.'
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto)
    return {
      message:
        'A Token will be sent to your email if we are able to find an account with the provided email'
    }
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    await this.authService.updateUserPassword(resetPasswordDto, token)
    return {
      message: 'Password updated! Please log in to enjoy our platform.'
    }
  }

  @Patch('/user/username')
  @UseGuards(JwtAuthGuard)
  async updateUsername(
    @Body() updateUsernameDto: UpdateUsernameDto,
    @GetUser() user: User,
    @Req() req: Request
  ) {
    const { cookie, loggedInUserInfo } = await this.authService.updateUsername(
      updateUsernameDto,
      user
    )
    req.res.setHeader('Set-Cookie', cookie)
    return loggedInUserInfo
  }

  @Patch('/user/password')
  @UseGuards(JwtAuthGuard)
  async updateCurrentPassword(
    @Body() updateCurrentPasswordDto: UpdateCurrentPasswordDto,
    @GetUser() user: User,
    @Req() req: Request
  ) {
    await this.authService.updateCurrentPassword(updateCurrentPasswordDto, user)
    const { cookie } = this.authService.getCookieWithJwtToken(user)
    req.res.setHeader('Set-Cookie', cookie)
    return this.authService.getLoggedInUserInfo(user)
  }

  @Post('/logout')
  async logout(@Req() req: Request) {
    const cookie = this.authService.logout()
    req.res.setHeader('Set-Cookie', cookie)
    return { message: 'Logged out' }
  }

  @Get('/validate')
  @UseGuards(JwtAuthGuard)
  async validade(@GetUser() user: User) {
    return this.authService.getLoggedInUserInfo(user)
  }

  @Get('/validate-cookie')
  @UseGuards(JwtAuthGuard)
  async validadeCookie() {
    return { valid: true }
  }
}
