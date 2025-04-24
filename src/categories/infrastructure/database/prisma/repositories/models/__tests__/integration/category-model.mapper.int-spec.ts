import {
  Category,
  PrismaClient,
} from '@/shared/infrastructure/database/generated/prisma';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { CategoryModelMapper } from '../../category-model.mapper';
import { CategoryEntity } from '@/categories/domain/entities/category.entity';

describe('CategoryModelMapper Integration Tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.category.deleteMany();
    props = {
      name: 'Category 2',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should convert a category model to a category entity', async () => {
    const model: Category = await prismaService.category.create({
      data: props,
    });
    const sut = CategoryModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(CategoryEntity);
    expect(sut.toJSON()).toStrictEqual({
      id: model.id,
      ...props,
    });
  });
});
