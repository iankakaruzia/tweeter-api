import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileUpload } from 'graphql-upload'
import { UploadService } from 'src/upload/upload.service'
import { User } from 'src/users/entities/user.entity'
import { CreatePostInput } from './dtos/create-post.input'
import { Post } from './entities/post.entity'
import { PostRepository } from './repositories/post.repository'

@Injectable()
export class PostsService {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(PostRepository) private postRepository: PostRepository
  ) {}

  async createPost(
    image: FileUpload,
    createPostInput: CreatePostInput,
    user: User
  ): Promise<Post> {
    const content = createPostInput?.content
    const isPublic = createPostInput?.isPublic
    if (!content && !image) {
      throw new BadRequestException(
        'Please provide a text content or a image to create a post'
      )
    }
    let imageUrl: string
    if (image) {
      const { createReadStream } = image
      const fileStream = createReadStream()
      const { secure_url } = await this.uploadService.uploadStream(fileStream, {
        folder: 'posts',
        tags: ['post'],
        allowed_formats: ['jpg', 'png']
      })
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

  async getPost(id: number) {
    const post = await this.postRepository.findOne(id)
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }
}
