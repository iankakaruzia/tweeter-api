import { Field, InputType } from '@nestjs/graphql'
import { Exclude } from 'class-transformer'
import { FileUpload, GraphQLUpload } from 'graphql-upload'

@InputType()
export class UpdateProfilePhotoInput {
  @Exclude()
  @Field((_type) => GraphQLUpload)
  photo: Promise<FileUpload>
}
