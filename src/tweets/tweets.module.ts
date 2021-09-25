import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UploadModule } from 'src/upload/upload.module'
import { TweetsResolver } from './tweets.resolver'
import { TweetsService } from './tweets.service'

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [TweetsResolver, TweetsService],
  exports: [TweetsService]
})
export class TweetsModule {}
