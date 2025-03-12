import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateExpenseDto {
  @ApiPropertyOptional({
    description: 'The UUID of the account associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  accountId?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the category associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'The amount of the expense',
    example: 150.75,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'The description of the expense',
    example: 'Updated grocery shopping',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The date of the expense',
    example: '2023-10-05',
  })
  @IsDate()
  @IsOptional()
  date?: Date;
}
