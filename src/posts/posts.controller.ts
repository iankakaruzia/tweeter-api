import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InjectRepository } from '@nestjs/typeorm'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UploadService } from 'src/upload/upload.service'
import { User } from 'src/users/entities/user.entity'
import { CreatePostBodyDto } from './dtos/create-post-body.dto'
import { PostRepository } from './repositories/post.repository'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('posts')
export class PostsController {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(PostRepository) private postRepository: PostRepository
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async createPost(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostBodyDto: CreatePostBodyDto,
    @GetUser() user: User
  ) {
    const { content, isPublic } = createPostBodyDto
    if (!content && !image) {
      throw new BadRequestException(
        'Please provide a text content or a image to create a post'
      )
    }
    let imageUrl: string
    if (image) {
      const { secure_url } = await this.uploadService.uploadStream(
        image.buffer,
        {
          folder: 'posts',
          tags: ['post'],
          allowed_formats: ['jpg', 'png']
        }
      )
      imageUrl = secure_url
    }
    return this.postRepository.createPost(
      {
        content,
        imageUrl,
        isPublic
      },
      user
    )
  }
}
