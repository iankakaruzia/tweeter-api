import { ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/common/pagination/models/paginated.type'
import { SaveType } from './save.type'

@ObjectType()
export class PaginatedSaves extends Paginated(SaveType) {}
