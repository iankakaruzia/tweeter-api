import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsOptional()
  imageUrl: string

  @IsString()
  @IsOptional()
  content: string

  @IsBoolean()
  @IsOptional()
  isPublic: boolean
}
