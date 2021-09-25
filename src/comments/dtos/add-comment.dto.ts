import { Tweet as TweetModel } from '@prisma/client'

export class AddCommentDto {
  imageUrl?: string
  content?: string
  tweet: TweetModel
}
