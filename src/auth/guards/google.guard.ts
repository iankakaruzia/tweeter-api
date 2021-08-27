import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err ?? new BadRequestException('Unable to login with Google.')
    }

    return user
  }
}
