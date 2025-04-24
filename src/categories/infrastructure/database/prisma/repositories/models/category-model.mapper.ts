import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { Category } from '@/shared/infrastructure/database/generated/prisma';

export class CategoryModelMapper {
  static toEntity(categoryModel: Category) {
    const data = {
      name: categoryModel.name,
      createdAt: categoryModel.createdAt,
    };
    return new CategoryEntity(data, categoryModel.id);
  }
}
