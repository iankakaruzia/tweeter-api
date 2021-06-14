import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary
} from 'cloudinary'
import { ReadStream } from 'fs'

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadStream(
    fileStream: ReadStream,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET')
    })

    return new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        options,
        function (err, fileUploaded) {
          if (err) {
            reject(err)
          }

          resolve(fileUploaded)
        }
      )

      fileStream.pipe(cloudStream)
    })
  }
}
