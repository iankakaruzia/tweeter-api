import { IsOptional, IsString } from 'class-validator'

export class ImageUrlDto {
  @IsString()
  @IsOptional()
  imageUrl?: string
}
