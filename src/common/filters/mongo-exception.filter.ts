import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common'
import { MongoError } from 'mongodb'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse()
    if (exception.code === 11000) {
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
