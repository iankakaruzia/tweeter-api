import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileUpload } from 'graphql-upload'
import { TweetsService } from 'src/tweets/tweets.service'
import { UploadService } from 'src/upload/upload.service'
import { User } from 'src/users/entities/user.entity'
import { Comment } from './entities/comment.entity'
import { AddCommentInput } from './inputs/add-comment.input'
import { CommentRepository } from './repositories/comment.repository'

@Injectable()
export class CommentsService {
  constructor(
    private uploadService: UploadService,
    private tweetsService: TweetsService,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository
  ) {}

  async addComment(
    image: FileUpload,
    addCommentInput: AddCommentInput,
    user: User
  ): Promise<Comment> {
    const { content } = addCommentInput
    if (!content && !image) {
      throw new BadRequestException(
        'Please provide a text content or a image to add a comment'
      )
    }

    const tweet = await this.tweetsService.getTweet(addCommentInput.tweetId)

    let imageUrl: string
    if (image) {
      const { createReadStream } = image
      const fileStream = createReadStream()
      const { secure_url } = await this.uploadService.uploadStream(fileStream, {
        folder: 'comments',
        tags: ['comment'],
        allowed_formats: ['jpg', 'png']
      })
      imageUrl = secure_url
    }

    return this.commentRepository.addComment(
      {
        tweet,
        imageUrl,
        content
      },
      user
    )
  }

  async removeComment(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne(commentId)

    if (!comment) {
      throw new NotFoundException('Unable to find the comment')
    }

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('Only the user that liked can dislike')
    }

    await this.commentRepository.remove(comment)
  }

  async getComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne(id)
    if (!comment) {
      throw new NotFoundException('Unable to find a Comment with the given ID')
    }
    return comment
  }
}
