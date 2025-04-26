import { PrismaClient } from '@prisma/client';
import { NewCategoryDto } from '../../dtos/new-category.dto';
import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { CategoriesModule } from '../../categories.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import request from 'supertest';

describe('CategoriesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let newCategoryDto: NewCategoryDto;
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
    newCategoryDto = {
      name: 'Filmes',
    };

    await prismaService.category.deleteMany();
  });

  afterAll(async () => {
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(newCategoryDto)
        .expect(HttpStatus.CREATED);
    });

    it('should return an error with 422 code when the request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .send({})
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'name should not be empty',
        'name must be shorter than or equal to 128 characters',
        'name must be a string',
      ]);
    });
    it('should return an error with 422 code with invalid field provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(Object.assign(newCategoryDto, { invalidField: 'invalid' }))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'property invalidField should not exist',
      ]);
    });
    it('should return a error with 409 code when the name is duplicated', async () => {
      await prismaService.category.create({
        data: { name: 'Filmes' },
      });

      const response = await request(app.getHttpServer())
        .post('/categories')
        .send(newCategoryDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.error).toBe('Conflict');
      expect(response.body.message).toEqual('Category already exists');
    });
  });
});
