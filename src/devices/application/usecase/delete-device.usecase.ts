import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { UseCase } from '@/shared/application/usecases/use-case';

export type DeleteDeviceInput = {
  id: number;
};

export type DeleteDeviceOutput = VoidFunction;

export class DeleteDeviceUseCase
  implements UseCase<DeleteDeviceInput, DeleteDeviceOutput>
{
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute(input: DeleteDeviceInput): Promise<DeleteDeviceOutput> {
    const { id } = input;
    await this.deviceRepository.delete(id);
    return;
  }
}
