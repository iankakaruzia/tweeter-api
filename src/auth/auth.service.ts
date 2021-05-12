import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptographyService } from 'src/cryptography/cryptography.service'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { LoginCredentialsDto } from './dtos/login-credentials.dto'
import { RegisterCredentialsDto } from './dtos/register-credentials.dto'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private cryptographyService: CryptographyService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerCredentialsDto: RegisterCredentialsDto) {
    const { password } = registerCredentialsDto
    const hashedPassword = await this.cryptographyService.hash(password)
    const user = await this.usersService.createUser({
      ...registerCredentialsDto,
      password: hashedPassword
    })

    return this.getAccessToken(user)
  }

  async login(loginCredentialsDto: LoginCredentialsDto) {
    const { usernameOrEmail, password } = loginCredentialsDto
    const user = await this.usersService.getUserByUsernameOrEmail(
      usernameOrEmail
    )

    if (!user) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    const isValidPassword = await this.cryptographyService.compare(
      password,
      user.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid crendentials')
    }

    return this.getAccessToken(user)
  }

  private getAccessToken(user: User) {
    const payload: JwtPayload = { username: user.username }

    const accessToken = this.jwtService.sign(payload)

    return { accessToken }
  }
}
