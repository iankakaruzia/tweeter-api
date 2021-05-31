import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService
  ) {}

  async sendForgotPasswordEmail(user: User, token: string) {
    const url = `${this.configService.get<string>(
      'CLIENT_RESET_PASSWORD_URL'
    )}${token}`

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot your Password?',
      template: './forgot-password',
      context: {
        name: user.name || user.username,
        email: user.email,
        url,
        logo: this.configService.get<string>('CLIENT_URL')
      }
    })
  }
}
