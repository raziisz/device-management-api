import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { CreateDeviceUseCase } from '../../create-device.usecase';
import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

describe('CreateDeviceUseCase Unit tests', () => {
  let sut: CreateDeviceUseCase;
  let repository: DeviceRepository;
  let categoryRepository: CategoryRepository;
  beforeEach(() => {
    repository = {
      insert: jest.fn(),
    } as any;
    categoryRepository = {
      findById: jest.fn(),
    } as any;
    sut = new CreateDeviceUseCase(repository, categoryRepository);
  });

  it('Should create a device', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const spyFindById = jest.spyOn(categoryRepository, 'findById');
    const props = {
      categoryId: 1,
      color: 'black',
      partNumber: 123,
    };
    const result = await sut.execute(props);

    expect(result).toBeUndefined();
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });

  it('Should throws error when categoryId not provided', async () => {
    let props = {
      categoryId: null,
      color: 'black',
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      categoryId: 0,
      color: 'black',
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      categoryId: -1,
      color: 'black',
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when color not provided', async () => {
    let props = {
      categoryId: 1,
      color: null,
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      categoryId: 1,
      color: '',
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
    props = {
      categoryId: 1,
      color: '  ',
      partNumber: 123,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('Should throws error when partNumber not provided', async () => {
    let props = {
      categoryId: 1,
      color: 'black',
      partNumber: null,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      categoryId: 1,
      color: 'black',
      partNumber: 0,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = {
      categoryId: 1,
      color: 'black',
      partNumber: -1,
    };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('Should throws error when category not found', async () => {
    const props = {
      categoryId: 1,
      color: 'black',
      partNumber: 123,
    };
    jest
      .spyOn(categoryRepository, 'findById')
      .mockRejectedValue(new NotFoundError('Category not found'));
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
