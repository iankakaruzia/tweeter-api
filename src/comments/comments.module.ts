import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UploadModule } from 'src/upload/upload.module'
import { CommentsResolver } from './comments.resolver'
import { CommentsService } from './comments.service'

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService]
})
export class CommentsModule {}
