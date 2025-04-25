import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { DevicePrismaRepository } from '../../device-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { Category } from '@prisma/client';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import {
  DeviceSearchParams,
  DeviceSearchResult,
} from '@/devices/domain/repositories/device.repository';

describe('DevicePrismaRepository Integration tests', () => {
  const prismaService = new PrismaService();
  let sut: DevicePrismaRepository;
  let module: TestingModule;
  let category: Category;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.category.deleteMany();
    category = await prismaService.category.create({
      data: { name: 'Teste', created_at: new Date() },
    });
  });

  beforeEach(async () => {
    sut = new DevicePrismaRepository(prismaService as any);
    await prismaService.device.deleteMany();
  });

  afterAll(async () => {
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throws error on insert when device conflict', async () => {
    await prismaService.device.create({
      data: {
        category_id: category.id,
        color: 'red',
        part_number: 1234,
        created_at: new Date(),
      },
    });

    const entity = new DeviceEntity({
      categoryId: category.id,
      partNumber: 1234,
      color: 'red',
    });

    await expect(() => sut.insert(entity)).rejects.toThrow(
      new ConflictError('Device already exists'),
    );
  });

  it('should insert a new device', async () => {
    const entity = new DeviceEntity({
      categoryId: category.id,
      partNumber: 321,
      color: 'red',
    });
    await sut.insert(entity);

    const result = await prismaService.device.findUnique({
      where: { part_number: entity.partNumber },
    });

    expect(result.part_number).toStrictEqual(entity.partNumber);
    expect(result.color).toStrictEqual(entity.color);
    expect(result.category_id).toStrictEqual(entity.categoryId);
    expect(result.created_at).toStrictEqual(entity.createdAt);
  });

  it('should throws error on delete when device not found', async () => {
    await expect(() => sut.delete(1234)).rejects.toThrow(
      new NotFoundError('Device not found'),
    );
  });

  it('should delete a device', async () => {
    const entity = new DeviceEntity({
      categoryId: category.id,
      partNumber: 1234,
      color: 'red',
    });

    const newDevice = await prismaService.device.create({
      data: {
        category_id: entity.categoryId,
        part_number: entity.partNumber,
        color: entity.color,
        created_at: entity.createdAt,
      },
    });

    await sut.delete(newDevice.id);

    const output = await prismaService.category.findUnique({
      where: { id: newDevice.id },
    });
    expect(output).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: DeviceEntity[] = [];
      const arrange = Array(16)
        .fill(0)
        .map((_, index) => ({
          partNumber: index + 1,
          color: `Color ${index}`,
          categoryId: category.id,
        }));

      arrange.forEach((element, index) => {
        entities.push(
          new DeviceEntity({
            ...element,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.device.createMany({
        data: entities.map(entity => {
          return {
            part_number: entity.partNumber,
            color: entity.color,
            category_id: entity.categoryId,
            created_at: entity.createdAt,
          };
        }),
      });

      const searchOutput = await sut.search(new DeviceSearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(DeviceSearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(DeviceEntity);
      });
      items.reverse().forEach((item, index) => {
        console.log(item.partNumber);
        expect(`Color ${index + 1}`).toBe(item.color);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date();
      const entities: DeviceEntity[] = [];
      const arrange = [123, 321, 11, 22, 33];

      arrange.forEach((element, index) => {
        entities.push(
          new DeviceEntity({
            partNumber: element,
            color: `Color ${index}`,
            categoryId: category.id,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.device.createMany({
        data: entities.map(entity => {
          return {
            part_number: entity.partNumber,
            color: entity.color,
            category_id: entity.categoryId,
            created_at: entity.createdAt,
          };
        }),
      });

      const searchOutputPage1 = await sut.search(
        new DeviceSearchParams({
          page: 1,
          perPage: 2,
          sort: 'created_at',
          sortDir: 'asc',
          filter: '123',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject({
        ...entities[0].toJSON(),
        id: searchOutputPage1.items[0].id,
      });

      const searchOutputPage2 = await sut.search(
        new DeviceSearchParams({
          page: 1,
          perPage: 2,
          sort: 'created_at',
          sortDir: 'asc',
          filter: '22',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject({
        ...entities[3].toJSON(),
        id: searchOutputPage2.items[0].id,
      });
    });
  });
});
