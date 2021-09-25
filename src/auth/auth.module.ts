import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CryptographyModule } from 'src/cryptography/cryptography.module'
import { MailModule } from 'src/mail/mail.module'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { FacebookStrategy } from './strategies/facebook.strategy'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategies/google.strategy'
import { TwitterStrategy } from './strategies/twitter.strategy'
import { GithubStrategy } from './strategies/github.strategy'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: `${configService.get('JWT_EXPIRES_IN')}s`
          }
        }
      }
    }),
    CryptographyModule,
    MailModule,
    PrismaModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    FacebookStrategy,
    GoogleStrategy,
    TwitterStrategy,
    GithubStrategy
  ],
  exports: [JwtStrategy, PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
