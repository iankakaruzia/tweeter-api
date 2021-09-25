import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { SavesResolver } from './saves.resolver'
import { SavesService } from './saves.service'

@Module({
  imports: [PrismaModule],
  providers: [SavesService, SavesResolver]
})
export class SavesModule {}
