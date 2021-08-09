import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard'
import { SentryInterceptor } from 'src/common/interceptors/sentry.interceptor'
import { UploadService } from 'src/upload/upload.service'
import { User } from './entities/user.entity'
import { UpdateCoverPhotoInput } from './inputs/update-cover-photo.input'
import { UpdateProfilePhotoInput } from './inputs/update-profile-photo.input'
import { UpdateProfileInput } from './inputs/update-profile.input'
import { UserType } from './models/user.type'
import { UserRepository } from './repositories/user.repository'

@UseInterceptors(SentryInterceptor)
@Resolver((_of: any) => UserType)
export class UsersResolver {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
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
    return this.userRepository.updateUserProfile(updateProfileInput, user)
  }

  @Mutation((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async updateProfilePhoto(
    @Args('updateProfilePhotoInput')
    updateProfilePhotoInput: UpdateProfilePhotoInput,
    @CurrentUser() user: User
  ) {
    const { photo } = updateProfilePhotoInput
    const { createReadStream } = await photo
    const photoStream = createReadStream()
    const { secure_url } = await this.uploadService.uploadStream(photoStream, {
      use_filename: true,
      filename_override: user.username,
      unique_filename: false,
      folder: 'profile',
      tags: ['profile'],
      allowed_formats: ['jpg', 'png']
    })
    return this.userRepository.updateUserProfilePhoto(secure_url, user)
  }

  @Mutation((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async updateCoverPhoto(
    @Args('updateCoverPhotoInput')
    updateCoverPhotoInput: UpdateCoverPhotoInput,
    @CurrentUser() user: User
  ) {
    const { photo } = updateCoverPhotoInput
    const { createReadStream } = await photo
    const photoStream = createReadStream()
    const { secure_url } = await this.uploadService.uploadStream(photoStream, {
      folder: 'cover',
      tags: ['cover'],
      allowed_formats: ['jpg', 'png']
    })
    return await this.userRepository.updateUserCoverPhoto(secure_url, user)
  }
}
