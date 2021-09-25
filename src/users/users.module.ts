import { Module } from '@nestjs/common'
import { UploadModule } from 'src/upload/upload.module'
import { UsersResolver } from './users.resolver'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [UploadModule, PrismaModule],
  providers: [UsersResolver, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
