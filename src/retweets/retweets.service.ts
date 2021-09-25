import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User as UserModel } from '@prisma/client'

@Injectable()
export class RetweetsService {
  constructor(private prisma: PrismaService) {}

  async retweet(tweetId: number, user: UserModel) {
    const retweetedTweet = await this.prisma.retweet.findFirst({
      where: {
        tweetId,
        authorId: user.id
      }
    })
    if (retweetedTweet) {
      throw new BadRequestException('Tweet already saved')
    }
    return this.prisma.retweet.create({
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

  async removeRetweet(retweetId: number, user: UserModel) {
    const retweet = await this.prisma.retweet.findUnique({
      where: { id: retweetId }
    })
    if (!retweet) {
      throw new NotFoundException('Unable to find the retweet')
    }
    if (retweet.authorId !== user.id) {
      throw new ForbiddenException('Only the user that retweeted can remove it')
    }
    await this.prisma.retweet.delete({
      where: {
        id: retweet.id
      }
    })
  }
}
