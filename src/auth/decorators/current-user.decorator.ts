import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
)
