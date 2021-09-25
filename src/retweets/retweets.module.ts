import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RetweetsResolver } from './retweets.resolver'
import { RetweetsService } from './retweets.service'

@Module({
  imports: [PrismaModule],
  providers: [RetweetsService, RetweetsResolver]
})
export class RetweetsModule {}
