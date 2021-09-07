import { Tweet } from 'src/tweets/entities/tweet.entity'

export class AddCommentDto {
  imageUrl?: string
  content?: string
  tweet: Tweet
}
