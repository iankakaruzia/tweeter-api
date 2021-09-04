import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createReadStream } from 'streamifier'
import { UploadService } from 'src/upload/upload.service'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
import { UpdateProfileDto } from './dtos/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async updateProfilePhoto(
    photo: Express.Multer.File,
    user: User
  ): Promise<User> {
    const photoStream = createReadStream(photo.buffer)
    const { secure_url } = await this.uploadService.uploadStream(photoStream, {
      use_filename: true,
      filename_override: user.username,
      unique_filename: false,
      folder: 'profile',
      tags: ['profile'],
      allowed_formats: ['jpg', 'png']
    })
    return this.userRepository.updateUserProfilePhoto(secure_url, user)
  }

  async updateCoverPhoto(
    cover: Express.Multer.File,
    user: User
  ): Promise<User> {
    const coverStream = createReadStream(cover.buffer)
    const { secure_url } = await this.uploadService.uploadStream(coverStream, {
      folder: 'cover',
      tags: ['cover'],
      allowed_formats: ['jpg', 'png']
    })
    return this.userRepository.updateUserCoverPhoto(secure_url, user)
  }

  async updateProfileInfo(
    updateProfileDto: UpdateProfileDto,
    user: User
  ): Promise<User> {
    return this.userRepository.updateUserProfile(updateProfileDto, user)
  }
}
