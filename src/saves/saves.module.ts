import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostsModule } from 'src/posts/posts.module'
import { SaveRepository } from './repositories/save.repository'
import { SavesResolver } from './saves.resolver'
import { SavesService } from './saves.service'

@Module({
  imports: [TypeOrmModule.forFeature([SaveRepository]), PostsModule],
  providers: [SavesService, SavesResolver]
})
export class SavesModule {}
