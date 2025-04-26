import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { applyGlobalConfig } from '@/global-config';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CategoriesModule } from '../../categories.module';
import { CategoryModelMapper } from '../../database/prisma/repositories/models/category-model.mapper';
import request from 'supertest';

describe('CategoriesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let categoryEntity: CategoryEntity;
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

    const model = await prismaService.category.create({
      data: {
        name: 'Categoria Teste',
        created_at: new Date(),
      },
    });

    categoryEntity = CategoryModelMapper.toEntity(model);
  });

  afterAll(async () => {
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/categories/${categoryEntity.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect({});
    });
    it('should return an error with 404 code when throw NotFoundError with invalid id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/categories/12345`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          error: 'Not Found',
        });
    });
  });
});
