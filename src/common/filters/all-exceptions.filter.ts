import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as Sentry from '@sentry/minimal'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Sentry.captureException(exception)
    }

    const errorResponse =
      typeof exception?.response === 'object' ? exception.response : {}

    if (response.status) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...errorResponse
      })
    } else {
      return exception
    }
  }
}
