import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { UseCase } from '@/shared/application/usecases/use-case';

export type DeleteCategoryInput = {
  id: number;
};
export type DeleteCategoryOutput = VoidFunction;

export class DeleteCategoryUseCase
  implements UseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const { id } = input;
    await this.categoryRepository.delete(id);
    return;
  }
}
