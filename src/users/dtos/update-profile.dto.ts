import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { IsValidAge } from 'src/common/decorators/is-valid-age.decorator'

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name: string

  @IsString()
  @MinLength(10)
  @IsOptional()
  bio: string

  @IsString()
  @MinLength(7)
  @MaxLength(15)
  @IsOptional()
  phone: string

  @IsDateString()
  @IsValidAge()
  @IsOptional()
  birthday: Date
}
