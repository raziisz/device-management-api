import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { Device, Prisma } from '@prisma/client';

type DeviceWithCategory = Prisma.DeviceGetPayload<{
  include: { category: true };
}>;

export class DeviceModelMapper {
  static toEntity(deviceModel: DeviceWithCategory | Device) {
    let category = null;
    if ('category' in deviceModel) {
      category = new CategoryEntity(
        {
          createdAt: deviceModel.category.created_at,
          name: deviceModel.category.name,
        },
        deviceModel.category.id,
      );
    }
    const data = {
      categoryId: deviceModel.category_id,
      partNumber: deviceModel.part_number,
      category,
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
