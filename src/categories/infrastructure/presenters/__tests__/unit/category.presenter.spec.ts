import { instanceToPlain } from 'class-transformer';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../category.presenter';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

describe('CategoryPresenter', () => {
  const createdAt = new Date();
  let props = {
    id: 1,
    name: 'Category 1',
    createdAt,
  };
  let sut: CategoryPresenter;
  beforeEach(() => {
    sut = new CategoryPresenter(props);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut).toBeDefined();
      expect(sut).toBeInstanceOf(CategoryPresenter);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.createdAt).toEqual(props.createdAt);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 1,
        name: 'Category 1',
        createdAt: createdAt.toISOString(),
      });
    });
  });
});

describe('CategoryCollectionPresenter', () => {
  const createdAt = new Date();
  let props = {
    id: 1,
    name: 'Category 1',
    createdAt,
  };

  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new CategoryCollectionPresenter({
        items: [props],
        total: 1,
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
      });
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          total: 1,
          lastPage: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new CategoryPresenter(props)]);
    });

    it('should presenter data', () => {
      const sut = new CategoryCollectionPresenter({
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
            id: 1,
            name: 'Category 1',
            createdAt: createdAt.toISOString(),
          },
        ],
      });
    });
  });
});
