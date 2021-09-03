import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common'
import { TypeORMError } from 'typeorm'

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse()
    console.log('HERE')
    if (
      exception.message.includes(
        'duplicate key value violates unique constraint'
      )
    ) {
      response.status(HttpStatus.CONFLICT).json({
        message: 'The request could not be completed due to a conflict.'
      })
    } else {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.' })
    }
  }
}
