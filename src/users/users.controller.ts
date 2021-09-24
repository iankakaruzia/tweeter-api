import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ImageUrlDto } from './dtos/image-url.dto'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(200)
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(JwtAuthGuard)
  async uploadProfilePhoto(
    @UploadedFile() photo: Express.Multer.File,
    @Body() imageUrlDto: ImageUrlDto,
    @GetUser() user: User
  ) {
    return this.usersService.updateProfilePhoto(photo, imageUrlDto, user)
  }

  @HttpCode(200)
  @Post('cover-photo')
  @UseInterceptors(FileInterceptor('cover'))
  @UseGuards(JwtAuthGuard)
  async uploadCoverPhoto(
    @UploadedFile() cover: Express.Multer.File,
    @Body() imageUrlDto: ImageUrlDto,
    @GetUser() user: User
  ) {
    return this.usersService.updateCoverPhoto(cover, imageUrlDto, user)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfileInfo(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: User
  ) {
    return this.usersService.updateProfileInfo(updateProfileDto, user)
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@GetUser() user: User) {
    return user
  }
}
