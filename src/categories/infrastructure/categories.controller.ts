import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenters/category.presenter';
import { ListCategoryDto } from './dtos/list-category.dto';
import {
  ListCategoryOutput,
  ListCategoryUseCase,
} from '../application/usecases/list-category.usecase';

@Controller('categories')
export class CategoriesController {
  @Inject(ListCategoryUseCase)
  private listCategoryUseCase: ListCategoryUseCase;

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
  @HttpCode(HttpStatus.OK)
  @Get()
  async listDoctors(@Query() searchParams: ListCategoryDto) {
    const output = await this.listCategoryUseCase.execute(searchParams);
    return CategoriesController.listCategoryToResponse(output);
  }
}
