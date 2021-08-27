import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FacebookGuard extends AuthGuard('facebook') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err ?? new BadRequestException('Unable to login with Facebook.')
    }

    return user
  }
}
