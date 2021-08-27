import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

const configService = new ConfigService()

@Catch(HttpException)
export class AuthHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const redirectUrl = configService.get<string>('SOCIAL_LOGIN_REDIRECT_URL')

    response.redirect(`${redirectUrl}?status=failure`)
  }
}
