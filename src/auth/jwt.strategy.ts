import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserRepository } from 'src/users/repositories/user.repository'
import { JwtPayload } from './jwt-payload.interface'

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload
    const user = await this.userRepository.findOne({ username })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
