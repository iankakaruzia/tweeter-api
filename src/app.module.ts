import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { graphqlUploadExpress, GraphQLUpload } from 'graphql-upload'
import { UsersModule } from './users/users.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { MailModule } from './mail/mail.module'
import { configValidationSchema } from './config/config.schema'
import { TweetsModule } from './tweets/tweets.module'
import { LikesModule } from './likes/likes.module'
import { SavesModule } from './saves/saves.module'
import { RetweetsModule } from './retweets/retweets.module'
import { CommentsModule } from './comments/comments.module'
import { PrismaModule } from './prisma/prisma.module'

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
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
      resolvers: { Upload: GraphQLUpload },
      path: '/graphql'
    }),
    UsersModule,
    CryptographyModule,
    AuthModule,
    UploadModule,
    MailModule,
    TweetsModule,
    LikesModule,
    SavesModule,
    RetweetsModule,
    CommentsModule,
    PrismaModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
