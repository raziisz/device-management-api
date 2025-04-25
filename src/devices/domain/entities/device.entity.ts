import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { Entity } from '@/shared/domain/entities/entity';

export type DeviceProps = {
  categoryId: number;
  category?: CategoryEntity;
  color: string;
  partNumber: number;
  createdAt?: Date;
};

export class DeviceEntity extends Entity<DeviceProps> {
  constructor(
    protected readonly props: DeviceProps,
    id?: number,
  ) {
    super(props, id);
    this.props.createdAt = this.props.createdAt || new Date();
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get color() {
    return this.props.color;
  }

  get partNumber() {
    return this.props.partNumber;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get category() {
    return this.props.category;
  }
}
