import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { Category } from '@prisma/client';

export class CategoryModelMapper {
  static toEntity(categoryModel: Category) {
    const data = {
      name: categoryModel.name,
      createdAt: categoryModel.createdAt,
    };
    return new CategoryEntity(data, categoryModel.id);
  }

  static toModel(entity: CategoryEntity): Category {
    let id: number;
    try {
      id = entity.id;
    } catch (error) {
      id = null;
    }
    return {
      id,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }
}
