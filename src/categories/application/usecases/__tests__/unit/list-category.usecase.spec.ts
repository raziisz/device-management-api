import {
  CategoryRepository,
  CategorySearchResult,
} from '@/categories/domain/repositories/category.repository';
import { ListCategoryUseCase } from '../../list-category.usecase';
import { CategoryEntity } from '@/categories/domain/entities/category.entity';

describe('ListCategoryUseCase Unit tests', () => {
  let sut: ListCategoryUseCase;
  let repository: CategoryRepository;
  beforeEach(() => {
    repository = {
      search: jest.fn(),
    } as any;
    sut = new ListCategoryUseCase(repository);
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should return a list of categories', async () => {
    const fakeResult = new CategorySearchResult({
      items: [new CategoryEntity({ name: 'Movie' })],
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: 'name',
      sortDir: 'asc',
      filter: 'Movie',
    });
    const spySearch = jest
      .spyOn(repository, 'search')
      .mockResolvedValue(fakeResult);
    const props = {
      page: 1,
      perPage: 10,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'Movie',
    };
    const result = await sut.execute(props);

    expect(result).toBeDefined();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toContain('Movie');
    expect(result.currentPage).toBe(props.page);
    expect(result.perPage).toBe(props.perPage);
    expect(spySearch).toHaveBeenCalledTimes(1);
  });
});
