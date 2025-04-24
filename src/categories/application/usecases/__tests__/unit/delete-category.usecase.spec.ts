import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { DeleteCategoryUseCase } from '../../delete-category.usecase';

describe('DeleteCategoryUseCase Unit tests', () => {
  let sut: DeleteCategoryUseCase;
  let repository: CategoryRepository;
  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    } as any;
    sut = new DeleteCategoryUseCase(repository);
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should delete a category', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const props = {
      id: 1,
    };
    const result = await sut.execute(props);

    expect(result).toBeUndefined();
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
