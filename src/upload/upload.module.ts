import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UploadService } from './upload.service'

@Module({
  imports: [ConfigModule],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}
