import {
  InternalServerErrorException,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/gql-auth-guard'
import { SentryInterceptor } from 'src/common/interceptors/sentry.interceptor'
import { UploadService } from 'src/upload/upload.service'
import { User } from './entities/user.entity'
import { UpdateCoverPhotoInput } from './inputs/update-cover-photo.input'
import { UpdateProfilePhotoInput } from './inputs/update-profile-photo.input'
import { UpdateProfileInput } from './inputs/update-profile.input'
import { UserType } from './models/user.type'
import { UsersService } from './users.service'

@UseInterceptors(SentryInterceptor)
@Resolver((_of: any) => UserType)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private uploadService: UploadService
  ) {}

  @Query((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user
  }

  @Mutation((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async updateProfileInfo(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
    @CurrentUser() user: User
  ) {
    try {
      return await this.usersService.updateUserProfile(updateProfileInput, user)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Mutation((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async updateProfilePhoto(
    @Args('updateProfilePhotoInput')
    updateProfilePhotoInput: UpdateProfilePhotoInput,
    @CurrentUser() user: User
  ) {
    try {
      const { photo } = updateProfilePhotoInput
      const { secure_url } = await this.uploadService.uploadStream(photo, {
        use_filename: true,
        filename_override: user.username,
        unique_filename: false,
        folder: 'profile',
        tags: ['profile'],
        allowed_formats: ['jpg', 'png']
      })
      return await this.usersService.updateUserProfilePhoto(secure_url, user)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Mutation((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async updateCoverPhoto(
    @Args('updateCoverPhotoInput')
    updateCoverPhotoInput: UpdateCoverPhotoInput,
    @CurrentUser() user: User
  ) {
    try {
      const { photo } = updateCoverPhotoInput
      const { secure_url } = await this.uploadService.uploadStream(photo, {
        folder: 'cover',
        tags: ['cover'],
        allowed_formats: ['jpg', 'png']
      })
      return await this.usersService.updateUserCoverPhoto(secure_url, user)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
