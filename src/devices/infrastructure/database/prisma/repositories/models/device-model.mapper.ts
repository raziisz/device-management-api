import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { Device } from '@prisma/client';

export class DeviceModelMapper {
  static toEntity(deviceModel: Device) {
    const data = {
      categoryId: deviceModel.category_id,
      partNumber: deviceModel.part_number,
      color: deviceModel.color,
      createdAt: deviceModel.created_at,
    };
    return new DeviceEntity(data, deviceModel.id);
  }

  static toModel(entity: DeviceEntity): Device {
    let id: number;
    try {
      id = entity.id;
    } catch (error) {
      id = null;
    }
    return {
      id,
      category_id: entity.categoryId,
      part_number: entity.partNumber,
      color: entity.color,
      created_at: entity.createdAt,
    };
  }
}
