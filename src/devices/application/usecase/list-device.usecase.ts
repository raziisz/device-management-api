import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { DeviceOutput, DeviceOutputMapper } from '../dtos/device.output';
import {
  DeviceRepository,
  DeviceSearchParams,
  DeviceSearchResult,
} from '@/devices/domain/repositories/device.repository';
import { UseCase } from '@/shared/application/usecases/use-case';

export type ListDeviceInput = SearchInput;
export type ListDeviceOutput = PaginationOutput<DeviceOutput>;

export class ListDeviceUseCase
  implements UseCase<ListDeviceInput, ListDeviceOutput>
{
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute(input: ListDeviceInput): Promise<ListDeviceOutput> {
    const params = new DeviceSearchParams(input);
    const searchResult = await this.deviceRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: DeviceSearchResult): ListDeviceOutput {
    const items = searchResult.items.map(item =>
      DeviceOutputMapper.toOutput(item),
    );
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
