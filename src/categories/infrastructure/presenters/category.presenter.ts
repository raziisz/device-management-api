import { CategoryOutput } from '@/categories/application/dtos/category.output';
import { ListCategoryOutput } from '@/categories/application/usecases/list-category.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryPresenter {
  @ApiProperty({ description: 'ID of the category' })
  id: number;
  @ApiProperty({ description: 'Name of the category' })
  name: string;
  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;
  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.createdAt = output.createdAt;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];
  constructor(output: ListCategoryOutput) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map(item => new CategoryPresenter(item));
  }
}
