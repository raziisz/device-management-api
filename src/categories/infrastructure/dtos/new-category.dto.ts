import { CreateCategoryInput } from '@/categories/application/usecases/create-category.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NewCategoryDto implements CreateCategoryInput {
  @ApiProperty({ description: 'Name of the category' })
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  name: string;
}
