import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadModule } from 'src/upload/upload.module'
import { UserRepository } from './repositories/user.repository'
import { UsersResolver } from './users.resolver'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), UploadModule],
  providers: [UsersResolver, UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
