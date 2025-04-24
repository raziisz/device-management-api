import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { CreateCategoryUseCase } from '../../create-category.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('CreateCategoryUseCase Unit tests', () => {
  let sut: CreateCategoryUseCase;
  let repository: CategoryRepository;
  beforeEach(() => {
    repository = {
      insert: jest.fn(),
    } as any;
    sut = new CreateCategoryUseCase(repository);
  });

  it('Should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const props = {
      name: 'Movie',
    };
    const result = await sut.execute(props);

    expect(result).toBeUndefined();
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('Should throws error when name not provided', async () => {
    let props = {
      name: '',
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      name: '   ',
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
