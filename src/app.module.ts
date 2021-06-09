import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { typeOrmConfig } from './config/typeorm.config'
import { UsersModule } from './users/users.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
      }
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      uploads: false
    }),
    UsersModule,
    CryptographyModule,
    AuthModule,
    UploadModule,
    MailModule
  ]
})
export class AppModule {}
