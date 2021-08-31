import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { UsersModule } from './users/users.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { MailModule } from './mail/mail.module'
import { configValidationSchema } from './config/config.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          }
        }
      }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          autoLoadEntities: true,
          synchronize:
            configService.get('NODE_ENV') === 'production' ? false : true
        }
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true
    }),
    UsersModule,
    CryptographyModule,
    AuthModule,
    UploadModule,
    MailModule
  ]
})
export class AppModule {}
