import {
  DeviceRepository,
  DeviceSearchResult,
} from '@/devices/domain/repositories/device.repository';
import { ListDeviceUseCase } from '../../list-device.usecase';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { CategoryEntity } from '@/categories/domain/entities/category.entity';

describe('ListDeviceUseCase Unit tests', () => {
  let sut: ListDeviceUseCase;
  let repository: DeviceRepository;
  beforeEach(() => {
    repository = {
      search: jest.fn(),
    } as any;
    sut = new ListDeviceUseCase(repository);
  });

  it('Should list devices', async () => {
    const fakeResult = new DeviceSearchResult({
      items: [
        new DeviceEntity({
          categoryId: 1,
          color: 'black',
          partNumber: '123',
          category: new CategoryEntity(
            { name: 'Category 1', createdAt: new Date() },
            1,
          ),
        }),
      ],
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: 'createdAt',
      sortDir: 'asc',
      filter: '123',
    });
    const spySearch = jest
      .spyOn(repository, 'search')
      .mockResolvedValue(fakeResult);
    const props = {
      page: 1,
      perPage: 10,
      sort: 'partNumber',
      sort_dir: 'asc',
      filter: '123',
    };
    const result = await sut.execute(props);

    expect(result).toBeDefined();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].partNumber).toBe('123');
    expect(result.total).toBe(1);
    expect(result.currentPage).toBe(props.page);
    expect(result.perPage).toBe(props.perPage);
    expect(spySearch).toHaveBeenCalledTimes(1);
  });
});
