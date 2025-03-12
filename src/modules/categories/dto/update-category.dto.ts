import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    description: 'The name of the category',
    example: 'Updated Groceries',
    maxLength: 50,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the category is a default category',
    example: true,
  })
  isDefault?: boolean;
}
