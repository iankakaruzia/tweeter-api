import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { UserInputError } from 'apollo-server-errors'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { UploadService } from 'src/upload/upload.service'
import { User } from 'src/users/entities/user.entity'
import { CreatePostInput } from './dtos/create-post.input'
import { PostType } from './models/post.type'
import { PostRepository } from './repositories/post.repository'

@Resolver((_of: any) => PostType)
export class PostsResolver {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(PostRepository) private postRepository: PostRepository
  ) {}

  @Mutation((_returns) => PostType)
  @UseGuards(GqlAuthGuard)
  async uploadFile(
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
    @Args('createPostInput', { nullable: true })
    createPostInput: CreatePostInput,
    @CurrentUser() user: User
  ) {
    const content = createPostInput?.content
    const isPublic = createPostInput?.isPublic
    if (!content && !image) {
      throw new UserInputError(
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
}
