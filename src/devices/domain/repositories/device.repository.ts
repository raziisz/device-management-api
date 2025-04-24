import { Entity } from '@/shared/domain/entities/entity';
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from '@/shared/domain/repositories/searchable-repository.contracts';
import { DeviceEntity } from '../entities/device.entity';

export type DeviceFilter = string;
export class DeviceSearchParams extends SearchParams<DeviceFilter> {}
export class DeviceSearchResult<
  DEntity extends Entity = DeviceEntity,
> extends SearchResult<DEntity, DeviceFilter> {}

export interface DeviceRepository<DEntity extends Entity = DeviceEntity>
  extends SearchableRepositoryInterface<
    DEntity,
    DeviceFilter,
    DeviceSearchParams,
    DeviceSearchResult
  > {}
