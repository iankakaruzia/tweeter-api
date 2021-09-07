import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TweetsModule } from 'src/tweets/tweets.module'
import { UploadModule } from 'src/upload/upload.module'
import { CommentsResolver } from './comments.resolver'
import { CommentsService } from './comments.service'
import { CommentRepository } from './repositories/comment.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository]),
    UploadModule,
    TweetsModule
  ],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService]
})
export class CommentsModule {}
