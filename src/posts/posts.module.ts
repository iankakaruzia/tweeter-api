import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadModule } from 'src/upload/upload.module'
import { PostRepository } from './repositories/post.repository'
import { PostsResolver } from './posts.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository]), UploadModule],
  providers: [PostsResolver]
})
export class PostsModule {}