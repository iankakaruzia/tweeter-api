import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { CryptographyModule } from 'src/cryptography/cryptography.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from 'src/users/repositories/user.repository'
import { MailModule } from 'src/mail/mail.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || 3600
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
    CryptographyModule,
    UsersModule,
    MailModule
  ],
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
