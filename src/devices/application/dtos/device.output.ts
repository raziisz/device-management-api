import { CategoryOutput } from '@/categories/application/dtos/category.output';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';

export type DeviceOutput = {
  id: number;
  categoryId: number;
  category?: CategoryOutput;
  color: string;
  partNumber: string;
  createdAt: Date;
};

export class DeviceOutputMapper {
  static toOutput(entity: DeviceEntity): DeviceOutput {
    return {
      ...entity.toJSON(),
      category: entity.category?.toJSON(),
    };
  }
}
