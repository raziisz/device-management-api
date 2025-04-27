import { DeviceOutput } from '@/devices/application/dtos/device.output';
import { DevicesController } from '../../devices.controller';
import { ListDeviceOutput } from '@/devices/application/usecase/list-device.usecase';
import { ListDeviceDto } from '../../dtos/list-device.dto';
import { DeviceCollectionPresenter } from '../../presenters/device.presenter';

describe('DevicesController', () => {
  let sut: DevicesController;
  let id: number;
  let props: DeviceOutput;

  beforeEach(async () => {
    sut = new DevicesController();
    id = 1;
    props = {
      id,
      partNumber: '123456',
      color: 'red',
      categoryId: 1,
      category: {
        id: 1,
        name: 'Category 1',
        createdAt: new Date(),
      },
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
  it('should create a device', async () => {
    const mockCreateDeviceUseCase = {
      execute: jest.fn(),
    };

    sut['createDeviceUseCase'] = mockCreateDeviceUseCase as any;
    const input = {
      categoryId: 1,
      color: 'red',
      partNumber: '123456',
    };

    const presenter = await sut.create(input);

    expect(presenter).toBeUndefined();
    expect(mockCreateDeviceUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should list devices', async () => {
    const output: ListDeviceOutput = {
      items: [props],
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    };

    const mockListDevicesUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['listDeviceUseCase'] = mockListDevicesUseCase as any;
    const searchParams: ListDeviceDto = {
      page: 1,
      perPage: 1,
    };

    const presenter = await sut.read(searchParams);
    expect(presenter).toBeInstanceOf(DeviceCollectionPresenter);
    expect(presenter).toEqual(new DeviceCollectionPresenter(output));
    expect(mockListDevicesUseCase.execute).toHaveBeenCalledWith(searchParams);
  });

  it('should delete a device', async () => {
    const output = undefined;
    const mockDeleteDeviceUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };
    sut['deleteDeviceUseCase'] = mockDeleteDeviceUseCase as any;
    const result = await sut.delete(id);
    expect(output).toStrictEqual(result);
    expect(mockDeleteDeviceUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
