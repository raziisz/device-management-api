import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from '@/shared/domain/repositories/searchable-repository.contracts';
import { CategoryEntity } from '../category.entity';
import { Entity } from '@/shared/domain/entities/entity';

export type CategoryFilter = string;
export class CategorySearchParams extends SearchParams<CategoryFilter> {}
export class CategorySearchResult<
  CEntity extends Entity = CategoryEntity,
> extends SearchResult<CEntity, CategoryFilter> {}

export interface CategoryRepository<CEntity extends Entity = CategoryEntity>
  extends SearchableRepositoryInterface<
    CEntity,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
