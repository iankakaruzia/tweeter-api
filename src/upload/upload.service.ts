import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary
} from 'cloudinary'
import { FileUpload } from 'graphql-upload'

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadStream(
    file: Promise<FileUpload>,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    const { createReadStream } = await file
    const fileStream = createReadStream()
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')
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
