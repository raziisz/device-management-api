import { ListDeviceInput } from '@/devices/application/usecase/list-device.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository.contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString } from 'class-validator';

export class ListDeviceDto implements ListDeviceInput {
  @ApiPropertyOptional({ description: 'Page actual' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantity of items per page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Sorting field: "created_at", "part_number", "color"',
  })
  @IsOptional()
  @IsIn(['created_at', 'part_number', 'color'], {
    message: 'Value sort must be "created_at" or "part_number" or "color"',
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
    description: 'Filter by part number or color',
  })
  @IsOptional()
  filter?: string;
}
