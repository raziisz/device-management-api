import { CategoryPresenter } from '@/categories/infrastructure/presenters/category.presenter';
import {
  DeviceCollectionPresenter,
  DevicePresenter,
} from '../../device.presenter';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

describe('DevicePresenter', () => {
  const createdAt = new Date();
  let props = {
    id: 1,
    partNumber: 123456,
    color: 'red',
    categoryId: 1,
    category: {
      id: 1,
      name: 'Category 1',
      createdAt,
    },
    createdAt,
  };
  let sut: DevicePresenter;
  beforeEach(() => {
    sut = new DevicePresenter(props);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut).toBeInstanceOf(DevicePresenter);
      expect(sut.id).toBe(props.id);
      expect(sut.partNumber).toBe(props.partNumber);
      expect(sut.color).toBe(props.color);
      expect(sut.category).toBeInstanceOf(CategoryPresenter);
      expect(sut.createdAt).toBe(props.createdAt);
    });
  });

  it('should presenter data', () => {
    const output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      id: props.id,
      partNumber: props.partNumber,
      color: props.color,
      category: instanceToPlain(new CategoryPresenter(props.category)),
      createdAt: props.createdAt.toISOString(),
    });
  });
});

describe('DeviceCollectionPresenter', () => {
  const createdAt = new Date();
  let props = {
    id: 1,
    partNumber: 123456,
    color: 'red',
    categoryId: 1,
    category: {
      id: 1,
      name: 'Category 1',
      createdAt,
    },
    createdAt,
  };

  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new DeviceCollectionPresenter({
        items: [props],
        total: 1,
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
      });
      expect(sut).toBeDefined();
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          total: 1,
          lastPage: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new DevicePresenter(props)]);
    });

    it('should presenter data', () => {
      const sut = new DeviceCollectionPresenter({
        items: [props],
        total: 1,
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
      });
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        meta: {
          currentPage: 1,
          perPage: 2,
          total: 1,
          lastPage: 1,
        },
        data: [
          {
            id: props.id,
            partNumber: props.partNumber,
            color: props.color,
            category: instanceToPlain(new CategoryPresenter(props.category)),
            createdAt: props.createdAt.toISOString(),
          },
        ],
      });
    });
  });
});
