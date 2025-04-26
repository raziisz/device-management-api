import { CategoryOutput } from '@/categories/application/dtos/category.output';
import { CategoriesController } from '../../categories.controller';
import { ListCategoryOutput } from '@/categories/application/usecases/list-category.usecase';
import { ListCategoryDto } from '../../dtos/list-category.dto';
import { CategoryCollectionPresenter } from '../../presenters/category.presenter';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('CategoriesController', () => {
  let sut: CategoriesController;
  let id: number;
  let props: CategoryOutput;

  beforeEach(async () => {
    sut = new CategoriesController();
    id = 1;
    props = {
      id,
      name: 'any_name',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a category with success', async () => {
    const input = { name: 'any_name' };
    const mockCreateCategoryUseCase = {
      execute: jest.fn(),
    };
    sut['createCategoryUseCase'] = mockCreateCategoryUseCase as any;
    const presenter = await sut.create(input);
    expect(presenter).toBeUndefined();
    expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should throws error BadRequest when create category with values invalid', async () => {
    const input = { name: '' };
    const mockCreateCategoryUseCase = {
      execute: jest.fn().mockRejectedValue(new BadRequestError('error')),
    };

    sut['createCategoryUseCase'] = mockCreateCategoryUseCase as any;
    await expect(sut.create(input)).rejects.toThrow(
      new BadRequestError('error'),
    );
  });

  it('should list categories', async () => {
    const output: ListCategoryOutput = {
      items: [props],
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    };

    const mockListCategoriesUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };
    sut['listCategoryUseCase'] = mockListCategoriesUseCase as any;
    const searchParams: ListCategoryDto = {
      page: 1,
      perPage: 1,
    };

    const presenter = await sut.read(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
    expect(mockListCategoriesUseCase.execute).toHaveBeenCalledWith(
      searchParams,
    );
  });

  it('should delete a category', async () => {
    const output = undefined;
    const mockDeleteCategoryUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };
    sut['deleteCategoryUseCase'] = mockDeleteCategoryUseCase as any;
    const presenter = await sut.delete(id);
    expect(presenter).toStrictEqual(output);
    expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
