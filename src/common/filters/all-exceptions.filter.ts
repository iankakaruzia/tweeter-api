import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as Sentry from '@sentry/minimal'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

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

    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, request, response)
    }

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

  private handlePrismaError(
    exception: PrismaClientKnownRequestError,
    request: Request,
    response: Response
  ) {
    if (response.status) {
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'The request could not be completed due to a conflict.'
        })
      } else {
        Sentry.captureException(exception)
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error.' })
      }
    } else {
      return exception
    }
  }
}
