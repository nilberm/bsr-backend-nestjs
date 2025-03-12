import { PartialType } from '@nestjs/mapped-types';
import { CreateEarningDto } from './create-earning.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEarningDto extends PartialType(CreateEarningDto) {
  @ApiPropertyOptional({
    description: 'The description of the earning',
    example: 'Updated Freelance Project Payment',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The amount of the earning',
    example: 2000.5,
  })
  amount?: number;

  @ApiPropertyOptional({
    description: 'The UUID of the account associated with the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  accountId?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the category associated with the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId?: string;
}
