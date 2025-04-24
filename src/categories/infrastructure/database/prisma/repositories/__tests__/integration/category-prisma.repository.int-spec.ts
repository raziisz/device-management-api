import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { CategoryPrismaRepository } from '../../category-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '@/categories/domain/repositories/category.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('CategoryPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaService();
  let sut: CategoryPrismaRepository;
  let module: TestingModule;
  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new CategoryPrismaRepository(prismaService as any);
    await prismaService.category.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throws error on insert when category conflict', async () => {
    await prismaService.category.create({
      data: { name: 'Teste', created_at: new Date() },
    });

    const entity = new CategoryEntity({ name: 'Teste' });

    await expect(() => sut.insert(entity)).rejects.toThrow(
      new ConflictError('Category already exists'),
    );
  });

  it('should insert a new category', async () => {
    const entity = new CategoryEntity({ name: 'Teste Categoria' });
    await sut.insert(entity);

    const result = await prismaService.category.findUnique({
      where: { name: entity.name },
    });

    expect(result.name).toStrictEqual(entity.name);
  });

  it('should throws error on delete when category not found', async () => {
    await expect(() => sut.delete(1234)).rejects.toThrow(
      new NotFoundError('Category not found'),
    );
  });

  it('should delete a category', async () => {
    const entity = new CategoryEntity({ name: 'Teste Categoria' });
    delete entity.id;
    const newCategory = await prismaService.category.create({
      data: {
        name: entity.name,
        created_at: entity.createdAt,
      },
    });

    await sut.delete(newCategory.id);

    const output = await prismaService.category.findUnique({
      where: { id: newCategory.id },
    });
    expect(output).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: CategoryEntity[] = [];
      const arrange = Array(16)
        .fill(0)
        .map((_, index) => ({
          name: `Category ${index}`,
        }));

      arrange.forEach((element, index) => {
        entities.push(
          new CategoryEntity({
            ...element,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.category.createMany({
        data: entities.map(entity => {
          return {
            name: entity.name,
            created_at: entity.createdAt,
          };
        }),
      });

      const searchOutput = await sut.search(new CategorySearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(CategoryEntity);
      });
      items.reverse().forEach((item, index) => {
        expect(`Category ${index + 1}`).toBe(item.name);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date();
      const entities: CategoryEntity[] = [];
      const arrange = ['TEST', 'Movie', 'Category', 'b', 'Series'];

      arrange.forEach((element, index) => {
        entities.push(
          new CategoryEntity({
            name: element,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.category.createMany({
        data: entities.map(entity => {
          return {
            name: entity.name,
            created_at: entity.createdAt,
          };
        }),
      });

      const searchOutputPage1 = await sut.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject({
        ...entities[0].toJSON(),
        id: searchOutputPage1.items[0].id,
      });

      const searchOutputPage2 = await sut.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'Category',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject({
        ...entities[2].toJSON(),
        id: searchOutputPage2.items[0].id,
      });
    });
  });
});
