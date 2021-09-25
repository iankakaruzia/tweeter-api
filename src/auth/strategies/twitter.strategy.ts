import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-twitter'
import { Provider } from '@prisma/client'
import { AuthService } from '../auth.service'

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      consumerKey: configService.get('TWITTER_AUTH_API_KEY'),
      consumerSecret: configService.get('TWITTER_AUTH_API_SECRET_KEY'),
      callbackURL: 'http://localhost:8080/twitter/redirect'
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
        'We could not get a valid email for this twitter account.'
      )
    }

    let user = await this.authService.getUserByProvider(id, Provider.TWITTER)

    if (!user) {
      user = await this.authService.createUserByProvider({
        provider: Provider.TWITTER,
        providerId: id,
        name: displayName,
        email: emails[0].value,
        photoUrl: photos[0]?.value ?? null
      })
    }

    done(null, user)
  }
}
