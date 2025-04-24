import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { CategoryOutput, CategoryOutputMapper } from '../dtos/category.output';
import { UseCase } from '@/shared/application/usecases/use-case';
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '@/categories/domain/repositories/category.repository';

export type ListCategoryInput = SearchInput;
export type ListCategoryOutput = PaginationOutput<CategoryOutput>;

export class ListCategoryUseCase
  implements UseCase<ListCategoryInput, ListCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: ListCategoryInput): Promise<ListCategoryOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoryOutput {
    const items = searchResult.items.map(item =>
      CategoryOutputMapper.toOutput(item),
    );

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
