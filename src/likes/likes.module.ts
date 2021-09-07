import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LikeRepository } from './repositories/like.repository'
import { LikesService } from './likes.service'
import { LikesResolver } from './likes.resolver'
import { TweetsModule } from 'src/tweets/tweets.module'
import { CommentsModule } from 'src/comments/comments.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeRepository]),
    TweetsModule,
    CommentsModule
  ],
  providers: [LikesService, LikesResolver]
})
export class LikesModule {}
