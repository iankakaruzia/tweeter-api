import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, OAuth2Strategy } from 'passport-google-oauth'
import { UsersService } from 'src/users/users.service'
import { Provider } from '../enums/provider.enum'

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/google/redirect',
      scope: ['email', 'profile']
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    const { id, name, emails, photos } = profile

    let user = await this.usersService.findUserByProvider(Provider.GOOGLE, id)

    if (!user) {
      user = await this.usersService.createUserByProvider({
        provider: Provider.GOOGLE,
        providerId: id,
        name: name.givenName,
        email: emails[0].value,
        photoUrl: photos[0].value
      })
    }

    return user
  }
}
