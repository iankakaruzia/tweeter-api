import { IsNotEmpty, IsString } from 'class-validator'

export class LoginCredentialsDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string

  @IsString()
  @IsNotEmpty()
  password: string
}
