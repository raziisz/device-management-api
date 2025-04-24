import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenters/category.presenter';
import { ListCategoryDto } from './dtos/list-category.dto';
import {
  ListCategoryOutput,
  ListCategoryUseCase,
} from '../application/usecases/list-category.usecase';
import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';
import { NewCategoryDto } from './dtos/new-category.dto';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { DeleteCategoryUseCase } from '../application/usecases/delete-category.usecase';

@Controller('categories')
export class CategoriesController {
  @Inject(ListCategoryUseCase)
  private listCategoryUseCase: ListCategoryUseCase;

  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase;
  static listCategoryToResponse(output: ListCategoryOutput) {
    return new CategoryCollectionPresenter(output);
  }
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories list',
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { type: 'object', $ref: getSchemaPath(CategoryPresenter) },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'List all categories with pagination and filtering',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async read(@Query() searchParams: ListCategoryDto) {
    const output = await this.listCategoryUseCase.execute(searchParams);
    return CategoriesController.listCategoryToResponse(output);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid data',
  })
  @ApiOperation({
    summary: 'Create a new category',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() newCategoryDto: NewCategoryDto) {
    try {
      await this.createCategoryUseCase.execute(newCategoryDto);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted',
  })
  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteCategoryUseCase.execute({ id });
  }
}
