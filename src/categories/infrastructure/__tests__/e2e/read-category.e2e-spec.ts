import { applyGlobalConfig } from '@/global-config';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CategoriesModule } from '../../categories.module';
import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { CategoryModelMapper } from '../../database/prisma/repositories/models/category-model.mapper';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from '../../presenters/category.presenter';

describe('CategoriesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        CategoriesModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    await prismaService.category.deleteMany();
  });
  beforeEach(async () => {
    await prismaService.category.deleteMany();
  });
  afterAll(async () => {
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });
  describe('GET /categories', () => {
    it('should return the categories ordered by created', async () => {
      const createdAt = new Date();
      const entities: CategoryEntity[] = [];
      Array.from({ length: 3 }).forEach((_, index) => {
        entities.push(
          new CategoryEntity({
            name: ` Categoria ${index}`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });
      await prismaService.category.createMany({
        data: entities.map(entity => ({
          name: entity.name,
          created_at: entity.createdAt,
        })),
      });

      const models = await prismaService.category.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
      const categoriesEntity = models.map(CategoryModelMapper.toEntity);
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const response = await request(app.getHttpServer())
        .get(`/categories?${queryParams}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [...categoriesEntity].map(item =>
          instanceToPlain(
            new CategoryPresenter({
              id: item.id,
              name: item.name,
              createdAt: item.createdAt,
            }),
          ),
        ),
        meta: {
          total: 3,
          perPage: 15,
          currentPage: 1,
          lastPage: 1,
        },
      });
    });
    it('should return categories devices ordered, filtered and paginated', async () => {
      const createdAt = new Date();
      const entities: CategoryEntity[] = [];
      Array.from({ length: 3 }).forEach((_, index) => {
        entities.push(
          new CategoryEntity({
            name: ` Categoria ${index}`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });
      await prismaService.category.createMany({
        data: entities.map(entity => ({
          name: entity.name,
          created_at: entity.createdAt,
        })),
      });

      const models = await prismaService.category.findMany({
        where: {
          name: {
            contains: 'Categoria 1',
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      });
      const categoriesEntity = models.map(CategoryModelMapper.toEntity);
      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'created_at',
        sortDir: 'asc',
        filter: 'Categoria 1',
      };
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const response = await request(app.getHttpServer())
        .get(`/categories?${queryParams}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [...categoriesEntity].map(item =>
          instanceToPlain(
            new CategoryPresenter({
              id: item.id,
              name: item.name,
              createdAt: item.createdAt,
            }),
          ),
        ),
        meta: {
          total: 1,
          perPage: 2,
          currentPage: 1,
          lastPage: 1,
        },
      });
    });
    it('should return a error with 422 code when the query params invalid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories?anyid=10`)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'property anyid should not exist',
      ]);
    });
    it('should return a error with 422 code when the query params sort is invalid value', async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories?sort=createdAt`)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'Value sort must be "created_at" or "name"',
      ]);
    });
  });
});
