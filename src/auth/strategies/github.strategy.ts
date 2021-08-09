import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Profile, Strategy } from 'passport-github'
import { UserRepository } from 'src/users/repositories/user.repository'
import { Provider } from '../enums/provider.enum'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
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
    const { displayName, emails = [], id, photos, username } = profile
    if (!emails[0]?.value) {
      throw new BadRequestException(
        'We could not get a valid email for this github account.'
      )
    }

    let user = await this.userRepository.findUserByProvider(Provider.GITHUB, id)

    if (!user) {
      user = await this.userRepository.createUserByProvider({
        provider: Provider.GITHUB,
        providerId: id,
        username,
        name: displayName,
        email: emails[0].value,
        photoUrl: photos[0]?.value ?? null
      })
    }

    done(null, user)
  }
}
