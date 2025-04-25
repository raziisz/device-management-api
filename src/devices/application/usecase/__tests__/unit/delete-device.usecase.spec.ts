import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { DeleteDeviceUseCase } from '../../delete-device.usecase';

describe('DeleteDeviceUseCase Unit tests', () => {
  let sut: DeleteDeviceUseCase;
  let repository: DeviceRepository;
  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    } as any;
    sut = new DeleteDeviceUseCase(repository);
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should delete a device', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const props = {
      id: 1,
    };
    const result = await sut.execute(props);

    expect(result).toBeUndefined();
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
