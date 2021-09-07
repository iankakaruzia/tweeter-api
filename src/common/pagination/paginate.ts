import { LessThan, MoreThan, SelectQueryBuilder } from 'typeorm'
import { PageInfo } from './models/page-info.type'
import { PaginationArgs } from './models/pagination.args'

/**
 * Based on https://gist.github.com/tumainimosha/6652deb0aea172f7f2c4b2077c72d16c
 */

type PaginateArgs<T> = {
  query: SelectQueryBuilder<T>
  paginationArgs: PaginationArgs
  cursorColumn?: string
  columnName?: string
  defaultLimit?: number
}

export async function paginate<T>({
  query,
  paginationArgs,
  cursorColumn = 'id',
  columnName = 'id',
  defaultLimit = 25
}: PaginateArgs<T>) {
  query.orderBy({ [cursorColumn]: 'DESC' })

  const totalCountQuery = query.clone()

  if (paginationArgs.first) {
    if (paginationArgs.after) {
      const offsetId = Buffer.from(paginationArgs.after, 'base64').toString(
        'ascii'
      )
      query.andWhere({ [columnName]: LessThan(offsetId) })
    }
    const limit = paginationArgs.first ?? defaultLimit
    query.limit(limit)
  } else if (paginationArgs.last && paginationArgs.before) {
    const offsetId = Buffer.from(paginationArgs.before, 'base64').toString(
      'ascii'
    )
    const limit = paginationArgs.last ?? defaultLimit
    query.andWhere({ [columnName]: MoreThan(offsetId) }).limit(limit)
  }
  const result = await query.getMany()

  const startCursorId = result.length > 0 ? result[0][columnName] : null
  const endCursorId = result.length > 0 ? result.slice(-1)[0][columnName] : null
  const beforeQuery = totalCountQuery.clone()
  const afterQuery = beforeQuery.clone()

  let countBefore = 0
  let countAfter = 0
  if (
    beforeQuery.expressionMap.wheres &&
    beforeQuery.expressionMap.wheres.length
  ) {
    countBefore = await beforeQuery
      .andWhere(`${cursorColumn} > :cursor`, { cursor: startCursorId })
      .getCount()
    countAfter = await afterQuery
      .andWhere(`${cursorColumn} < :cursor`, { cursor: endCursorId })
      .getCount()
  } else {
    countBefore = await beforeQuery
      .where(`${cursorColumn} > :cursor`, { cursor: startCursorId })
      .getCount()

    countAfter = await afterQuery
      .where(`${cursorColumn} < :cursor`, { cursor: endCursorId })
      .getCount()
  }

  const edges = result.map((node) => ({
    node,
    cursor: Buffer.from(`${node[columnName]}`).toString('base64')
  }))

  const pageInfo = new PageInfo()
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null
  pageInfo.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : null
  pageInfo.hasNextPage = countAfter > 0
  pageInfo.hasPreviousPage = countBefore > 0

  return { edges, pageInfo }
}
