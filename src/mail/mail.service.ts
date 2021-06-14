import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/users/entities/user.entity'
import { MailProducer } from './jobs/mail.producer'

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailProducer: MailProducer
  ) {}

  async sendForgotPasswordEmail(user: User, token: string) {
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

  async sendConfirmationEmail(user: User, token: string) {
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
}
