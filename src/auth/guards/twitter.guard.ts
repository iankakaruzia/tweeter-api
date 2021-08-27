import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class TwitterGuard extends AuthGuard('twitter') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err ?? new BadRequestException('Unable to login with Twitter')
    }

    return user
  }
}
