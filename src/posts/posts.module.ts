import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadModule } from 'src/upload/upload.module'
import { PostRepository } from './repositories/post.repository'
import { PostsController } from './posts.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository]), UploadModule],
  controllers: [PostsController]
})
export class PostsModule {}
