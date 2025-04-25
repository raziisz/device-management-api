import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { DeviceOutputMapper } from '../../device.output';

describe('DeviceOutputMapper Unit tests', () => {
  it('Should convert a DeviceEntity to DeviceOutput', () => {
    const deviceEntity = new DeviceEntity(
      {
        categoryId: 1,
        color: 'Red',
        partNumber: 12345,
        createdAt: new Date('2023-01-01'),
      },
      1,
    );
    const sut = DeviceOutputMapper.toOutput(deviceEntity);
    expect(sut).toEqual({
      id: deviceEntity.id,
      categoryId: deviceEntity.categoryId,
      color: deviceEntity.color,
      partNumber: deviceEntity.partNumber,
      createdAt: deviceEntity.createdAt,
    });
  });
});
