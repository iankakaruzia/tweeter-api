import { Type } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { PageInfo } from './page-info.type'

interface IEdgeType<T> {
  cursor: string
  node: T
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[]
  pageInfo: PageInfo
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string

    @Field(() => classRef)
    node: T
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[]

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo
  }

  return PaginatedType as Type<IPaginatedType<T>>
}
