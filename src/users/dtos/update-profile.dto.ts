import { IsOptional, IsString, MaxLength } from 'class-validator'
import { IsValidAge } from 'src/common/decorators/is-valid-age.decorator'

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  bio: string

  @IsString()
  @MaxLength(15)
  @IsOptional()
  phone: string

  @IsValidAge()
  @IsOptional()
  birthday: Date
}
