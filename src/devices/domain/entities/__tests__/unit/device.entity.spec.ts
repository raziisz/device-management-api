import { DeviceEntity } from '../../device.entity';

describe('Device Entity Unit Tests', () => {
  it('should create a device entity with default createdAt date', () => {
    const device = new DeviceEntity({
      categoryId: 1,
      color: 'Red',
      partNumber: 12345,
    });
    expect(device.categoryId).toBe(1);
    expect(device.color).toBe('Red');
    expect(device.partNumber).toBe(12345);
    expect(device.createdAt).toBeInstanceOf(Date);
  });

  it('should create a device entity with custom createdAt date', () => {
    const customDate = new Date('2023-01-01');
    const device = new DeviceEntity(
      {
        categoryId: 1,
        color: 'Red',
        partNumber: 12345,
        createdAt: customDate,
      },
      1,
    );
    expect(device.categoryId).toBe(1);
    expect(device.color).toBe('Red');
    expect(device.partNumber).toBe(12345);
    expect(device.createdAt).toEqual(customDate);
  });

  it('should return the correct id', () => {
    const device = new DeviceEntity(
      { categoryId: 1, color: 'Red', partNumber: 12345 },
      1,
    );
    expect(device.id).toBe(1);
  });

  it('should return the correct JSON representation', () => {
    const customDate = new Date('2023-01-01');
    const device = new DeviceEntity(
      {
        categoryId: 1,
        color: 'Red',
        partNumber: 12345,
        createdAt: customDate,
      },
      1,
    );
    const json = device.toJSON();
    expect(json).toEqual({
      id: 1,
      categoryId: 1,
      color: 'Red',
      partNumber: 12345,
      createdAt: customDate,
    });
  });
});
