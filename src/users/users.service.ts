import { BadRequestException, Injectable } from '@nestjs/common'
import { createReadStream } from 'streamifier'
import { User as UserModel } from '@prisma/client'
import { UploadService } from 'src/upload/upload.service'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { ImageUrlDto } from './dtos/image-url.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService
  ) {}

  async updateProfilePhoto(
    photo: Express.Multer.File,
    imageUrlDto: ImageUrlDto,
    user: UserModel
  ) {
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
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        profilePhoto: imageUrl
      }
    })
    return {
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser?.name,
        profilePhoto: updatedUser?.profilePhoto
      }
    }
  }

  async updateCoverPhoto(
    cover: Express.Multer.File,
    imageUrlDto: ImageUrlDto,
    user: UserModel
  ) {
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
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        coverPhoto: imageUrl
      }
    })
    return {
      coverPhoto: imageUrl
    }
  }

  async updateProfileInfo(
    updateProfileDto: UpdateProfileDto,
    user: UserModel
  ): Promise<UserModel> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { ...updateProfileDto }
    })
  }

  sanityzeUser(user: UserModel) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      provider: user.provider,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      coverPhoto: user.coverPhoto,
      phone: user.phone,
      birthday: user.birthday
    }
  }
}
