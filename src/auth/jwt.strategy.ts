import { UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/users/users.service'
import { JwtPayload } from './jwt-payload.interface'

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey'
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload
    const user = await this.usersService.getUserByUsernameOrEmail(username)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
