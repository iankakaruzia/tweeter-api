import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err ?? new BadRequestException('Unable to login with Github.')
    }

    return user
  }
}
