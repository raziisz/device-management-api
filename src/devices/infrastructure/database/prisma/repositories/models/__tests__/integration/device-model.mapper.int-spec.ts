import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { DeviceModelMapper } from '../../device-model.mapper';
import { Category, Device, PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('DeviceModelMapper Integration Tests', () => {
  let prismaService: PrismaClient;
  let props: any;
  let category: Category;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
    category = await prismaService.category.create({
      data: {
        name: `Category ${Math.random() * 1000}`,
        created_at: new Date(),
      },
    });
  });

  beforeEach(async () => {
    await prismaService.device.deleteMany();

    props = {
      category_id: category.id,
      part_number: 123,
      color: 'red',
      created_at: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
  });

  it('Should convert a device model to a device entity', async () => {
    const model: Device = await prismaService.device.create({
      data: props,
    });
    const sut = DeviceModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(DeviceEntity);
    expect(sut.toJSON()).toStrictEqual({
      id: model.id,
      categoryId: model.category_id,
      partNumber: model.part_number,
      color: model.color,
      createdAt: model.created_at,
    });
  });

  it('Should convert a device entity to a device model', async () => {
    const entity = new DeviceEntity(
      {
        categoryId: category.id,
        partNumber: props.part_number,
        color: props.color,
        createdAt: props.created_at,
      },
      1,
    );
    const sut = DeviceModelMapper.toModel(entity);
    expect(sut).toStrictEqual({
      id: entity.id,
      category_id: entity.categoryId,
      part_number: entity.partNumber,
      color: entity.color,
      created_at: entity.createdAt,
    });
  });
});
