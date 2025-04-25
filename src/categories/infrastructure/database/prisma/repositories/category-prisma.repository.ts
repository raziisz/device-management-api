import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '@/categories/domain/repositories/category.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { CategoryModelMapper } from './models/category-model.mapper';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class CategoryPrismaRepository implements CategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<CategoryEntity> {
    return await this._get(id);
  }
  async search(
    props: CategorySearchParams,
  ): Promise<CategorySearchResult<CategoryEntity>> {
    const sortable = this.sortableFields.includes(props.sort);
    const orderByField = sortable ? props.sort : 'created_at';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.category.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
          },
        },
      }),
    });

    const models = await this.prismaService.category.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new CategorySearchResult({
      items: models.map(model => CategoryModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }
  async insert(entity: CategoryEntity): Promise<void | number> {
    const existsCategory = await this.prismaService.category.findUnique({
      where: { name: entity.name },
    });

    if (existsCategory) throw new ConflictError('Category already exists');

    const model = CategoryModelMapper.toModel(entity);
    delete model.id;
    const category = await this.prismaService.category.create({
      data: model,
    });

    return category.id;
  }
  async delete(id: number): Promise<void> {
    await this._get(id);
    await this.prismaService.category.delete({
      where: { id },
    });
  }

  protected async _get(id: number): Promise<CategoryEntity> {
    const model = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundError('Category not found');
    }

    return CategoryModelMapper.toEntity(model);
  }
}
