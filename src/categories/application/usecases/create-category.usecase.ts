import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase } from '@/shared/application/usecases/use-case';

export type CreateCategoryInput = {
  name: string;
};

export type CreateCategoryOutput = VoidFunction;

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const { name } = input;

    if (!name || name.trim() === '')
      throw new BadRequestError('Name category is required.');

    const entity = new CategoryEntity({ name });
    await this.categoryRepository.insert(entity);
    return;
  }
}
