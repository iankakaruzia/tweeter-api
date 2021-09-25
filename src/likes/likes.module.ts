import { Module } from '@nestjs/common'
import { LikesService } from './likes.service'
import { LikesResolver } from './likes.resolver'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [LikesService, LikesResolver]
})
export class LikesModule {}
