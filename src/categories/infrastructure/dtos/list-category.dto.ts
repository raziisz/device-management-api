import { ListCategoryInput } from '@/categories/application/usecases/list-category.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository.contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString } from 'class-validator';

export class ListCategoryDto implements ListCategoryInput {
  @ApiPropertyOptional({ description: 'Page actual' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantity of items per page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Sorting field: "createdAt", "name"',
  })
  @IsOptional()
  @IsIn(['createdAt', 'name'], {
    message: 'Value sort must be "createdAt" or "name"',
  })
  sort?: string;

  @ApiPropertyOptional({
    description: 'Sort direction: "asc" for ascending or "desc" for descending',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Filter by name',
  })
  @IsOptional()
  filter?: string;
}
