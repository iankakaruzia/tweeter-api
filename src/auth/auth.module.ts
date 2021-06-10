import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptographyModule } from 'src/cryptography/cryptography.module'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'
import { UserRepository } from 'src/users/repositories/user.repository'
import { MailModule } from 'src/mail/mail.module'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { AuthResolver } from './auth.resolver'

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
  providers: [AuthService, UsersService, JwtStrategy, AuthResolver],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
