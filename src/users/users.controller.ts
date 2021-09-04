import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InjectRepository } from '@nestjs/typeorm'
import { createReadStream } from 'streamifier'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UploadService } from 'src/upload/upload.service'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(JwtAuthGuard)
  async uploadProfilePhoto(
    @UploadedFile() photo: Express.Multer.File,
    @GetUser() user: User
  ) {
    if (!photo) {
      throw new BadRequestException('Is required that you send a valid image!')
    }
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

  @Post('cover-photo')
  @UseInterceptors(FileInterceptor('cover'))
  @UseGuards(JwtAuthGuard)
  async uploadCoverPhoto(
    @UploadedFile() cover: Express.Multer.File,
    @GetUser() user: User
  ) {
    if (!cover) {
      throw new BadRequestException('Is required that you send a valid image!')
    }
    const coverStream = createReadStream(cover.buffer)
    const { secure_url } = await this.uploadService.uploadStream(coverStream, {
      folder: 'cover',
      tags: ['cover'],
      allowed_formats: ['jpg', 'png']
    })
    return this.userRepository.updateUserCoverPhoto(secure_url, user)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfileInfo(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: User
  ) {
    return this.userRepository.updateUserProfile(updateProfileDto, user)
  }
}
