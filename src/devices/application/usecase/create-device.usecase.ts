import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCase } from '@/shared/application/usecases/use-case';

export type CreateDeviceInput = {
  categoryId: number;
  color: string;
  partNumber: string;
};

export type CreateDeviceOutput = VoidFunction;

export class CreateDeviceUseCase
  implements UseCase<CreateDeviceInput, CreateDeviceOutput>
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateDeviceInput): Promise<CreateDeviceOutput> {
    const { categoryId, color, partNumber } = input;

    if (!categoryId || categoryId <= 0)
      throw new BadRequestError('Category ID is required.');
    if (!color || color.trim() === '')
      throw new BadRequestError('Color is required.');
    if (color && !/^[a-zA-ZÀ-ÿ\s]*$/.test(color))
      throw new BadRequestError('Color must contain only letters.');
    if (!partNumber || Number(partNumber) <= 0)
      throw new BadRequestError('Part number is required.');
    if (isNaN(Number(partNumber)))
      throw new BadRequestError('Part number must be a number.');

    await this.categoryRepository.findById(categoryId);

    const entity = new DeviceEntity({ categoryId, color, partNumber });
    await this.deviceRepository.insert(entity);
    return;
  }
}
