import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User as UserModel } from '@prisma/client'

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likeTweet(tweetId: number, user: UserModel) {
    const likedTweet = await this.prisma.like.findFirst({
      where: {
        tweetId,
        authorId: user.id
      }
    })
    if (likedTweet) {
      throw new BadRequestException('Tweet already liked')
    }
    return this.prisma.like.create({
      data: {
        author: {
          connect: { id: user.id }
        },
        tweet: {
          connect: { id: tweetId }
        }
      },
      include: {
        author: true,
        tweet: true
      }
    })
  }

  async likeComment(commentId: number, user: UserModel) {
    const likedComment = await this.prisma.like.findFirst({
      where: {
        commentId,
        authorId: user.id
      }
    })
    if (likedComment) {
      throw new BadRequestException('Comment already liked')
    }
    return this.prisma.like.create({
      data: {
        author: {
          connect: { id: user.id }
        },
        comment: {
          connect: { id: commentId }
        }
      },
      include: {
        author: true,
        comment: true
      }
    })
  }

  async dislike(likeId: number, user: UserModel) {
    const like = await this.prisma.like.findUnique({
      where: { id: likeId }
    })
    if (!like) {
      throw new NotFoundException('Unable to find a like')
    }
    if (like.authorId !== user.id) {
      throw new ForbiddenException('Only the user that liked can dislike')
    }
    await this.prisma.like.delete({
      where: { id: like.id }
    })
  }
}
