import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github'
import { Provider } from '@prisma/client'
import { AuthService } from '../auth.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('GITHUB_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_AUTH_CLIENT_SECRET'),
      scope: 'user:email',
      callbackURL: 'http://localhost:8080/github/redirect'
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ) {
    const { displayName, emails = [], id, photos } = profile
    if (!emails[0]?.value) {
      throw new BadRequestException(
        'We could not get a valid email for this github account.'
      )
    }

    let user = await this.authService.getUserByProvider(id, Provider.GITHUB)

    if (!user) {
      user = await this.authService.createUserByProvider({
        provider: Provider.GITHUB,
        providerId: id,
        name: displayName,
        email: emails[0].value,
        photoUrl: photos[0]?.value ?? null
      })
    }

    done(null, user)
  }
}
