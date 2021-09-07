import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileUpload } from 'graphql-upload'
import { UploadService } from 'src/upload/upload.service'
import { User } from 'src/users/entities/user.entity'
import { CreateTweetInput } from './inputs/create-tweet.input'
import { Tweet } from './entities/tweet.entity'
import { TweetRepository } from './repositories/tweet.repository'

@Injectable()
export class TweetsService {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(TweetRepository) private tweetRepository: TweetRepository
  ) {}

  async createTweet(
    image: FileUpload,
    createTweetInput: CreateTweetInput,
    user: User
  ): Promise<Tweet> {
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
    return this.tweetRepository.createTweet(
      {
        content,
        imageUrl,
        isPublic
      },
      user
    )
  }

  async getTweet(id: number): Promise<Tweet> {
    const tweet = await this.tweetRepository.findOne(id)
    if (!tweet) {
      throw new NotFoundException('Unable to find a Tweet with the given ID')
    }
    return tweet
  }
}
