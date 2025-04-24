import { CategoryEntity } from '@/categories/domain/entities/category.entity';

export type CategoryOutput = {
  id: number;
  name: string;
  createdAt: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: CategoryEntity): CategoryOutput {
    return entity.toJSON();
  }
}
