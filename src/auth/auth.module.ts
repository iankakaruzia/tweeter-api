import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CryptographyModule } from 'src/cryptography/cryptography.module'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'
import { UserRepository } from 'src/users/repositories/user.repository'
import { MailModule } from 'src/mail/mail.module'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthResolver } from './auth.resolver'

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
            expiresIn: configService.get('JWT_EXPIRES_IN')
          }
        }
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
