import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import {
  DeviceRepository,
  DeviceSearchParams,
  DeviceSearchResult,
} from '@/devices/domain/repositories/device.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { DeviceModelMapper } from './models/device-model.mapper';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class DevicePrismaRepository implements DeviceRepository {
  sortableFields: string[] = ['created_at'];
  constructor(private prismaService: PrismaService) {}
  async search(
    props: DeviceSearchParams,
  ): Promise<DeviceSearchResult<DeviceEntity>> {
    const sortable = this.sortableFields.includes(props.sort);
    const orderByField = sortable ? props.sort : 'created_at';
    const orderByDir = sortable ? props.sortDir : 'desc';
    const toPartNumberFilter =
      props.filter?.length <= 14 ? props.filter : undefined;
    const count = await this.prismaService.device.count({
      ...(props.filter && {
        where: {
          OR: [
            {
              part_number: !isNaN(Number(toPartNumberFilter))
                ? Number(toPartNumberFilter)
                : undefined,
            },
            {
              color: {
                contains: props.filter,
              },
            },
          ],
        },
      }),
    });

    const models = await this.prismaService.device.findMany({
      ...(props.filter && {
        where: {
          OR: [
            {
              part_number: !isNaN(Number(toPartNumberFilter))
                ? Number(toPartNumberFilter)
                : undefined,
            },
            {
              color: {
                contains: props.filter,
              },
            },
          ],
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });
    return new DeviceSearchResult({
      items: models.map(DeviceModelMapper.toEntity),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }
  async insert(entity: DeviceEntity): Promise<void | number> {
    const existsDevice = await this.prismaService.device.findUnique({
      where: { part_number: entity.partNumber },
    });
    if (existsDevice) throw new ConflictError('Device already exists');

    const model = DeviceModelMapper.toModel(entity);
    delete model.id;
    await this.prismaService.device.create({
      data: model,
    });
  }
  async findById(id: number): Promise<DeviceEntity> {
    return await this._get(id);
  }
  async delete(id: number): Promise<void> {
    await this._get(id);
    await this.prismaService.device.delete({
      where: { id },
    });
  }

  protected async _get(id: number): Promise<DeviceEntity> {
    const model = await this.prismaService.device.findUnique({
      where: { id },
    });

    if (!model) throw new NotFoundError('Device not found');

    return DeviceModelMapper.toEntity(model);
  }
}
