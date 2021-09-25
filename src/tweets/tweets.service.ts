import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { FileUpload } from 'graphql-upload'
import { UploadService } from 'src/upload/upload.service'
import { CreateTweetInput } from './inputs/create-tweet.input'
import { Tweet as TweetModel, User as UserModel } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TweetsService {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService
  ) {}

  async createTweet(
    image: FileUpload,
    createTweetInput: CreateTweetInput,
    user: UserModel
  ): Promise<TweetModel> {
    const content = createTweetInput?.content
    const isPublic = createTweetInput?.isPublic
    if (!content && !image) {
      throw new BadRequestException(
        'Please provide a text content or a image to create a tweet'
      )
    }
    let imageUrl: string
    if (image) {
      const { createReadStream } = image
      const fileStream = createReadStream()
      const { secure_url } = await this.uploadService.uploadStream(fileStream, {
        folder: 'tweets',
        tags: ['tweet'],
        allowed_formats: ['jpg', 'png']
      })
      imageUrl = secure_url
    }
    return this.prisma.tweet.create({
      data: {
        content,
        imageUrl,
        isPublic,
        authorId: user.id
      },
      include: {
        author: true
      }
    })
  }

  async getTweet(id: number): Promise<TweetModel> {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        author: true
      }
    })
    if (!tweet) {
      throw new NotFoundException('Unable to find a Tweet with the given ID')
    }
    return tweet
  }
}
