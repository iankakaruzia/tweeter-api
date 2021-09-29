import { BadRequestException, Injectable } from '@nestjs/common'
import { createReadStream } from 'streamifier'
import { User as UserModel } from '@prisma/client'
import { UploadService } from 'src/upload/upload.service'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { ImageUrlDto } from './dtos/image-url.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { SingleFollowType } from './models/follow.type'

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
    const { name, bio, phone, birthday } = updateProfileDto
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...this.convertEmptyStringsToNull('name', name),
        ...this.convertEmptyStringsToNull('bio', bio),
        ...this.convertEmptyStringsToNull('phone', phone),
        ...this.convertEmptyStringsToNull('birthday', birthday)
      }
    })
  }

  convertEmptyStringsToNull(key: string, value: string | Date) {
    if (!value && value !== '') return {}
    if (value === '') {
      return {
        [key]: null
      }
    }
    return {
      [key]: value
    }
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

  async following(user: UserModel) {
    const result = await this.prisma.follows.findMany({
      where: {
        followerId: user.id
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      }
    })
    const count = result.length
    const following: SingleFollowType[] = result.map((followerInfo) => ({
      createdAt: followerInfo.createdAt,
      ...followerInfo.following
    }))
    return {
      count,
      following
    }
  }

  async followers(user: UserModel) {
    const result = await this.prisma.follows.findMany({
      where: {
        followingId: user.id
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      }
    })
    const count = result.length
    const followers: SingleFollowType[] = result.map((followerInfo) => ({
      createdAt: followerInfo.createdAt,
      ...followerInfo.follower
    }))
    return {
      count,
      followers
    }
  }

  async follow(
    userFollowedId: number,
    user: UserModel
  ): Promise<SingleFollowType> {
    if (user.id === userFollowedId) {
      throw new BadRequestException('You cannot follow yourself.')
    }
    const followInfo = await this.prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: user.id
          }
        },
        following: {
          connect: {
            id: userFollowedId
          }
        }
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true
          }
        }
      }
    })

    return {
      createdAt: followInfo.createdAt,
      ...followInfo.following
    }
  }

  async unfollow(userUnfollowedId: number, user: UserModel) {
    if (user.id === userUnfollowedId) {
      throw new BadRequestException('You cannot unfollow yourself.')
    }
    await this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userUnfollowedId
        }
      }
    })
  }
}
