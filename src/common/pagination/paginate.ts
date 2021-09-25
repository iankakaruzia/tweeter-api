import { PrismaService } from 'src/prisma/prisma.service'
import { PageInfo } from './models/page-info.type'
import { PaginationArgs } from './models/pagination.args'

type PaginateArgs = {
  where?: Record<string, unknown>
  include?: Record<string, unknown>
  type: 'save'
  paginationArgs: PaginationArgs
  defaultLimit?: number
  prisma: PrismaService
}

export async function paginate({
  where = {},
  include = {},
  type,
  paginationArgs,
  defaultLimit = 25,
  prisma
}: PaginateArgs) {
  const { after, before, first, last } = paginationArgs
  const cursorInfo = {}
  let limit: number
  if (first) {
    if (after) {
      const offsetId = parseInt(Buffer.from(after, 'base64').toString('ascii'))
      cursorInfo['cursor'] = {
        id: offsetId
      }
      cursorInfo['skip'] = 1
    }
    limit = first ?? defaultLimit
  } else if (last && before) {
    const offsetId = parseInt(Buffer.from(before, 'base64').toString('ascii'))
    limit = -(last ?? defaultLimit)
    cursorInfo['cursor'] = {
      id: offsetId
    }
    cursorInfo['skip'] = 1
  }

  const result = await prisma[type].findMany({
    take: limit,
    ...cursorInfo,
    where: {
      ...where
    },
    orderBy: {
      id: 'desc'
    },
    include: {
      ...include
    }
  })

  const edges = result.map((node) => ({
    node,
    cursor: Buffer.from(`${node.id}`).toString('base64')
  }))

  const startCursorId = result.length > 0 ? result[0].id : null
  const endCursorId = result.length > 0 ? result.slice(-1)[0].id : null
  const countBefore = await prisma[type].count({
    where: {
      ...where,
      id: {
        gt: startCursorId
      }
    },
    orderBy: {
      id: 'desc'
    }
  })
  const countAfter = await prisma[type].count({
    where: {
      ...where,
      id: {
        lt: endCursorId
      }
    },
    orderBy: {
      id: 'desc'
    }
  })
  const pageInfo = new PageInfo()
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null
  pageInfo.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : null
  pageInfo.hasNextPage = countAfter > 0
  pageInfo.hasPreviousPage = countBefore > 0
  return { edges, pageInfo }
}
