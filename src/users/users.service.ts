import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createReadStream } from 'streamifier'
import { UploadService } from 'src/upload/upload.service'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { ImageUrlDto } from './dtos/image-url.dto'

@Injectable()
export class UsersService {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async updateProfilePhoto(
    photo: Express.Multer.File,
    imageUrlDto: ImageUrlDto,
    user: User
  ): Promise<User> {
    const { imageUrl: url } = imageUrlDto
    let imageUrl: string
    if (!photo && !url) {
      throw new BadRequestException('Please provide a valid photo or image url')
    }
    if (url) {
      const { secure_url } = await this.uploadService.upload(url, {
        folder: 'profile',
        tags: ['profile'],
        allowed_formats: ['jpg', 'png']
      })
      imageUrl = secure_url
    } else {
      const photoStream = createReadStream(photo.buffer)
      const { secure_url } = await this.uploadService.uploadStream(
        photoStream,
        {
          folder: 'profile',
          tags: ['profile'],
          allowed_formats: ['jpg', 'png']
        }
      )
      imageUrl = secure_url
    }
    return this.userRepository.updateUserProfilePhoto(imageUrl, user)
  }

  async updateCoverPhoto(
    cover: Express.Multer.File,
    imageUrlDto: ImageUrlDto,
    user: User
  ): Promise<User> {
    const { imageUrl: url } = imageUrlDto
    let imageUrl: string
    if (!cover && !url) {
      throw new BadRequestException('Please provide a valid cover or image url')
    }
    if (url) {
      const { secure_url } = await this.uploadService.upload(url, {
        folder: 'cover',
        tags: ['cover'],
        allowed_formats: ['jpg', 'png']
      })
      imageUrl = secure_url
    } else {
      const coverStream = createReadStream(cover.buffer)
      const { secure_url } = await this.uploadService.uploadStream(
        coverStream,
        {
          folder: 'cover',
          tags: ['cover'],
          allowed_formats: ['jpg', 'png']
        }
      )
      imageUrl = secure_url
    }
    return this.userRepository.updateUserCoverPhoto(imageUrl, user)
  }

  async updateProfileInfo(
    updateProfileDto: UpdateProfileDto,
    user: User
  ): Promise<User> {
    return this.userRepository.updateUserProfile(updateProfileDto, user)
  }
}
