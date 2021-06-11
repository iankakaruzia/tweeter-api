import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UseInterceptors
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { randomBytes, createHash } from 'crypto'
import { SentryInterceptor } from 'src/common/interceptors/sentry.interceptor'
import { MailService } from 'src/mail/mail.service'
import { UserType } from 'src/users/models/user.type'
import { AuthService } from './auth.service'
import { ForgotPasswordInput } from './inputs/forgot-password.input'
import { LoginInput } from './inputs/login.input'
import { RegisterInput } from './inputs/register.input'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { AuthDefaultReturnType } from './models/auth-default-return.type'
import { AuthenticatedUserType } from './models/authenticated-user.type'

@UseInterceptors(SentryInterceptor)
@Resolver((_of: any) => UserType)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private mailService: MailService
  ) {}

  @Mutation((_returns) => AuthenticatedUserType)
  async login(@Args('loginInput') loginInput: LoginInput) {
    try {
      return await this.authService.login(loginInput)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Mutation((_returns) => AuthDefaultReturnType)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    try {
      const confirmationToken = randomBytes(32).toString('hex')

      const hashedConfirmationToken = createHash('sha256')
        .update(confirmationToken)
        .digest('hex')

      const user = await this.authService.register(
        registerInput,
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

  @Mutation((_returns) => AuthDefaultReturnType)
  async confirmateAccount(@Args('token') token: string) {
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

  @Mutation((_returns) => AuthDefaultReturnType)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput
  ) {
    try {
      const { email } = forgotPasswordInput
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

  @Mutation((_returns) => AuthDefaultReturnType)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput
  ) {
    try {
      const { password, token } = resetPasswordInput
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
}
