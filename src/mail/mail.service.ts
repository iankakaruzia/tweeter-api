import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User as UserModel } from '@prisma/client'
import { MailProducer } from './jobs/mail.producer'

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailProducer: MailProducer
  ) {}

  async sendForgotPasswordEmail(user: UserModel, token: string) {
    const url = `${this.configService.get('CLIENT_RESET_PASSWORD_URL')}${token}`

    await this.mailProducer.sendMail({
      to: user.email,
      subject: 'Forgot your Password?',
      template: './forgot-password',
      context: {
        name: user.name || user.username,
        email: user.email,
        url,
        logo: this.configService.get('CLIENT_URL')
      }
    })
  }

  async sendConfirmationEmail(user: UserModel, token: string) {
    const url = `${this.configService.get('CLIENT_CONFIRMATION_URL')}${token}`

    await this.mailProducer.sendMail({
      to: user.email,
      subject: 'Tweeter - Confirm your account!',
      template: './confirmation',
      context: {
        url,
        logo: this.configService.get('CLIENT_URL')
      }
    })
  }

  async sendSuccessfullConfirmationEmail(user: UserModel) {
    const url = `${this.configService.get('CLIENT_URL')}/home`

    await this.mailProducer.sendMail({
      to: user.email,
      subject: 'Tweeter - Account confirmated!',
      template: './successfull-confirmation',
      context: {
        url,
        logo: this.configService.get('CLIENT_URL')
      }
    })
  }

  async sendEmailUpdatedEmail(user: UserModel, newEmail: string) {
    await this.mailProducer.sendMail({
      to: user.email,
      subject: 'Tweeter - Email updated!',
      template: './updated-email',
      context: {
        email: newEmail,
        logo: this.configService.get('CLIENT_URL')
      }
    })
  }
}
