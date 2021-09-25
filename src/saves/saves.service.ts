import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PaginationArgs } from 'src/common/pagination/models/pagination.args'
import { PrismaService } from 'src/prisma/prisma.service'
import { User as UserModel } from '@prisma/client'
import { paginate } from 'src/common/pagination/paginate'
@Injectable()
export class SavesService {
  constructor(private prisma: PrismaService) {}
  async save(tweetId: number, user: UserModel) {
    const savedTweet = await this.prisma.save.findFirst({
      where: {
        tweetId,
        authorId: user.id
      }
    })
    if (savedTweet) {
      throw new BadRequestException('Tweet already saved')
    }
    return this.prisma.save.create({
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

  async removeSave(saveId: number, user: UserModel) {
    const save = await this.prisma.save.findUnique({
      where: { id: saveId }
    })
    if (!save) {
      throw new NotFoundException('Unable to find the save')
    }
    if (save.authorId !== user.id) {
      throw new ForbiddenException('Only the user that saved can remove it')
    }
    await this.prisma.save.delete({
      where: { id: save.id }
    })
  }

  async getSaves(paginationArgs: PaginationArgs, user: UserModel) {
    return paginate({
      type: 'save',
      where: {
        authorId: user.id
      },
      include: {
        author: true,
        tweet: {
          include: {
            author: true,
            likes: true,
            comments: true
          }
        }
      },
      paginationArgs,
      prisma: this.prisma
    })
  }
}
