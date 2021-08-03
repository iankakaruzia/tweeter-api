import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-facebook'
import { UsersService } from 'src/users/users.service'
import { Provider } from '../enums/provider.enum'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      clientID: configService.get('FACEBOOK_AUTH_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_AUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name']
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ) {
    const { name, emails, id } = profile
    let user = await this.usersService.findUserByProvider(Provider.FACEBOOK, id)

    if (!user) {
      user = await this.usersService.createUserByProvider({
        provider: Provider.FACEBOOK,
        providerId: id,
        name: name.givenName,
        email: emails[0].value
      })
    }

    done(null, user)
  }
}
