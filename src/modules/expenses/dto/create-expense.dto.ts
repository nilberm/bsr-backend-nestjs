import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'The UUID of the account associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({
    description: 'The UUID of the category associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'The amount of the expense',
    example: 100.5,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    description: 'The description of the expense',
    example: 'Grocery shopping',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The date of the expense',
    example: '2023-10-01',
  })
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
