import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User as UserModel } from '@prisma/client'

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserModel => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
  }
)
