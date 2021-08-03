import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-twitter'
import { UsersService } from 'src/users/users.service'
import { Provider } from '../enums/provider.enum'

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
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
    const { displayName, emails = [], id, username, photos } = profile

    if (!emails[0]?.value) {
      throw new BadRequestException(
        'We could not get a valid email for this twitter account.'
      )
    }

    let user = await this.usersService.findUserByProvider(Provider.TWITTER, id)

    if (!user) {
      user = await this.usersService.createUserByProvider({
        provider: Provider.TWITTER,
        providerId: id,
        name: displayName,
        username,
        email: emails[0].value,
        photoUrl: photos[0]?.value ?? null
      })
    }

    done(null, user)
  }
}
