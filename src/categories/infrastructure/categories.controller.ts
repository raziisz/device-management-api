import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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

@Controller('categories')
export class CategoriesController {
  @Inject(ListCategoryUseCase)
  private listCategoryUseCase: ListCategoryUseCase;

  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;

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
  async listDoctors(@Query() searchParams: ListCategoryDto) {
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
  async createDoctor(@Body() newCategoryDto: NewCategoryDto) {
    try {
      await this.createCategoryUseCase.execute(newCategoryDto);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
