import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LikeRepository } from './repositories/like.repository'
import { LikesService } from './likes.service'
import { LikesResolver } from './likes.resolver'
import { PostsModule } from 'src/posts/posts.module'

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository]), PostsModule],
  providers: [LikesService, LikesResolver]
})
export class LikesModule {}
