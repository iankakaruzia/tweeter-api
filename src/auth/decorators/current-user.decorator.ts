import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User as UserModel } from '@prisma/client'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserModel => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
)
