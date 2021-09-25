import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { FileUpload } from 'graphql-upload'
import { PrismaService } from 'src/prisma/prisma.service'
import { UploadService } from 'src/upload/upload.service'
import { User as UserModel, Comment as CommentModel } from '@prisma/client'
import { AddCommentInput } from './inputs/add-comment.input'

@Injectable()
export class CommentsService {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService
  ) {}

  async addComment(
    image: FileUpload,
    addCommentInput: AddCommentInput,
    user: UserModel
  ): Promise<CommentModel> {
    const { content, tweetId } = addCommentInput
    if (!content && !image) {
      throw new BadRequestException(
        'Please provide a text content or a image to add a comment'
      )
    }
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
    return this.prisma.comment.create({
      data: {
        imageUrl,
        content,
        tweet: {
          connect: { id: tweetId }
        },
        author: {
          connect: { id: user.id }
        }
      },
      include: {
        tweet: true,
        author: true
      }
    })
  }

  async removeComment(commentId: number, user: UserModel) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    })
    if (!comment) {
      throw new NotFoundException('Unable to find the comment')
    }
    if (comment.authorId !== user.id) {
      throw new ForbiddenException('Only the user that liked can dislike')
    }
    await this.prisma.comment.delete({
      where: { id: comment.id }
    })
  }

  async getComment(id: number): Promise<CommentModel> {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    })
    if (!comment) {
      throw new NotFoundException('Unable to find a Comment with the given ID')
    }
    return comment
  }
}
