import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginCredentialsDto } from './dtos/login-credentials.dto'
import { RegisterCredentialsDto } from './dtos/register-credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    try {
      return this.authService.register(registerCredentialsDto)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    try {
      return this.authService.login(loginCredentialsDto)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
