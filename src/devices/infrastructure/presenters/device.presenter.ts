import { CategoryPresenter } from '@/categories/infrastructure/presenters/category.presenter';
import { DeviceOutput } from '@/devices/application/dtos/device.output';
import { ListDeviceOutput } from '@/devices/application/usecase/list-device.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class DevicePresenter {
  @ApiProperty({ description: 'ID of the device' })
  id: number;
  @ApiProperty({ description: 'Part number of the device' })
  partNumber: number;
  @ApiProperty({ description: 'Color of the device' })
  color: string;
  @ApiProperty({ description: 'Category of the device' })
  category: CategoryPresenter;
  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  constructor(output: DeviceOutput) {
    this.id = output.id;
    this.partNumber = output.partNumber;
    this.color = output.color;
    this.category = new CategoryPresenter(output.category);
    this.createdAt = output.createdAt;
  }
}

export class DeviceCollectionPresenter extends CollectionPresenter {
  data: DevicePresenter[];

  constructor(output: ListDeviceOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new DevicePresenter(item));
  }
}
