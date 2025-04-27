import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { CategoriesModule } from '@/categories/infrastructure/categories.module';
import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DevicesModule } from '../../devices.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import request from 'supertest';
import { DeviceModelMapper } from '../../database/prisma/repositories/models/device-model.mapper';
import { instanceToPlain } from 'class-transformer';
import { DevicePresenter } from '../../presenters/device.presenter';

describe('DevicesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let categoryRepository: CategoryRepository;
  let deviceRepository: DeviceRepository;
  let categoryId: number;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        DevicesModule,
        CategoriesModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    categoryRepository = module.get<CategoryRepository>('CategoryRepository');
    deviceRepository = module.get<DeviceRepository>('DeviceRepository');
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    const categoryModel = await prismaService.category.create({
      data: {
        name: 'Category 1',
      },
    });
    categoryId = categoryModel.id;
  });

  beforeEach(async () => {
    await prismaService.device.deleteMany();
  });

  afterAll(async () => {
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });

  describe('GET /devices', () => {
    it('should return the devices ordered by createdAt', async () => {
      const createdAt = new Date();
      const entities: DeviceEntity[] = [];
      const arrange = Array(3).fill(null);
      arrange.forEach((_, index) => {
        entities.push(
          new DeviceEntity({
            categoryId: categoryId,
            color: ` Color ${index + 1}`,
            partNumber: `${index + 1}`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.device.createMany({
        data: entities.map(entity => ({
          category_id: entity.categoryId,
          color: entity.color,
          part_number: entity.partNumber,
          created_at: entity.createdAt,
        })),
      });

      const models = await prismaService.device.findMany({
        orderBy: { created_at: 'desc' },
        include: { category: true },
      });
      const devicesEntity = models.map(DeviceModelMapper.toEntity);
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const response = await request(app.getHttpServer())
        .get(`/devices?${queryParams}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body.data).toStrictEqual(
        [...devicesEntity].map(item => {
          return instanceToPlain(
            new DevicePresenter({
              categoryId: item.categoryId,
              color: item.color,
              partNumber: item.partNumber,
              createdAt: item.createdAt,
              id: item.id,
              category: {
                id: item.category.id,
                name: item.category.name,
                createdAt: item.category.createdAt,
              },
            }),
          );
        }),
      );
      expect(response.body.meta).toStrictEqual({
        total: 3,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
      });
      expect(response.body.data).toHaveLength(3);
    });
    it('should return the devices ordered, filtered and paginated', async () => {
      const createdAt = new Date();
      const entities: DeviceEntity[] = [];
      const arrange = [123, 321, 444];
      arrange.forEach((element, index) => {
        entities.push(
          new DeviceEntity({
            categoryId: categoryId,
            color: ` Color ${index + 1}`,
            partNumber: `${element}`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.device.createMany({
        data: entities.map(entity => ({
          category_id: entity.categoryId,
          color: entity.color,
          part_number: entity.partNumber,
          created_at: entity.createdAt,
        })),
      });

      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'created_at',
        sortDir: 'asc',
        filter: 444,
      };

      const queryParams = new URLSearchParams(searchParams as any).toString();

      const response = await request(app.getHttpServer())
        .get(`/devices?${queryParams}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body.data[0].partNumber).toBe('444');
      expect(response.body.meta).toStrictEqual({
        total: 1,
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
      });
      expect(response.body.data).toHaveLength(1);
    });

    it('should return a error with 422 code when the query params invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/devices?anyid=10`)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'property anyid should not exist',
      ]);
    });
    it('should return a error with 422 code when the query params sort is invalid value', async () => {
      const response = await request(app.getHttpServer())
        .get(`/devices?sort=createdAt`)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'Value sort must be "created_at" or "part_number" or "color"',
      ]);
    });
  });
});
