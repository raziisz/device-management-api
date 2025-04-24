import { Entity } from '@/shared/domain/entities/entity';

export type CategoryProps = {
  name: string;
  createdAt?: Date;
};

export class CategoryEntity extends Entity<CategoryProps> {
  constructor(
    protected readonly props: CategoryProps,
    id?: number,
  ) {
    super(props, id);
    this.props.createdAt = this.props.createdAt || new Date();
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
