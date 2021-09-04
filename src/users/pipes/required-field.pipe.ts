import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform
} from '@nestjs/common'

export class RequiredFieldPipe implements PipeTransform {
  constructor(private readonly fieldName: string) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `The field "${this.fieldName}" is required!`
      )
    }
    return value
  }
}
