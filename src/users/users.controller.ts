import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { User } from './entities/user.entity'
import { RequiredFieldPipe } from './pipes/required-field.pipe'
import { UsersService } from './users.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(JwtAuthGuard)
  async uploadProfilePhoto(
    @UploadedFile(new RequiredFieldPipe('photo')) photo: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.usersService.updateProfilePhoto(photo, user)
  }

  @Post('cover-photo')
  @UseInterceptors(FileInterceptor('cover'))
  @UseGuards(JwtAuthGuard)
  async uploadCoverPhoto(
    @UploadedFile(new RequiredFieldPipe('cover')) cover: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.usersService.updateCoverPhoto(cover, user)
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
