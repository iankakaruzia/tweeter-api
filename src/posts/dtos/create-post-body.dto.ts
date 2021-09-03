import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreatePostBodyDto {
  @IsString()
  @IsOptional()
  content: string

  @IsBoolean()
  @IsOptional()
  isPublic: boolean
}
