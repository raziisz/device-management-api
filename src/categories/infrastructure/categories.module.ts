import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { CategoryPrismaRepository } from './database/prisma/repositories/category-prisma.repository';
import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';
import { CategoryRepository } from '../domain/repositories/category.repository';
import { ListCategoryUseCase } from '../application/usecases/list-category.usecase';
import { DeleteCategoryUseCase } from '../application/usecases/delete-category.usecase';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'CategoryRepository',
      useFactory: (prismaService: PrismaService) =>
        new CategoryPrismaRepository(prismaService),
      inject: ['PrismaService'],
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) =>
        new CreateCategoryUseCase(categoryRepository),
      inject: ['CategoryRepository'],
    },
    {
      provide: ListCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) =>
        new ListCategoryUseCase(categoryRepository),
      inject: ['CategoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository) =>
        new DeleteCategoryUseCase(categoryRepository),
      inject: ['CategoryRepository'],
    },
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
