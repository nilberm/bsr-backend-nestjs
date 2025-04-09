/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiPropertyOptional({
    description:
      'The UUID of the account associated with the expense (optional if cardId is provided)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ValidateIf((o) => !o.cardId)
  @IsUUID()
  @IsNotEmpty()
  accountId?: string;

  @ApiPropertyOptional({
    description:
      'The UUID of the card associated with the expense (optional if accountId is provided)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ValidateIf((o) => !o.accountId)
  @IsUUID()
  @IsNotEmpty()
  cardId?: string;

  @ApiProperty({
    description: 'The UUID of the category associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174002',
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

  @ApiProperty({
    description: 'The type of expense: fixed or installments',
    example: 'fixed',
    enum: ['fixed', 'installments'],
  })
  @IsEnum(['fixed', 'installments'])
  type: 'fixed' | 'installments';

  @ApiPropertyOptional({
    description: 'Number of installments (only for installment expenses)',
    example: 3,
  })
  @ValidateIf((o) => o.type === 'installments')
  @IsNumber()
  @IsNotEmpty()
  installments?: number;

  @ApiPropertyOptional({
    description: 'Recurrence of the fixed expense (only for fixed type)',
    example: 'monthly',
    enum: ['one-time', 'monthly'],
    default: 'one-time',
  })
  @ValidateIf((o) => o.type === 'fixed')
  @IsIn(['one-time', 'monthly'])
  @IsOptional()
  recurrence?: 'one-time' | 'monthly';

  @ApiPropertyOptional({
    description:
      'End date of the recurrence (only required if recurrence is monthly)',
    example: '2024-10-01',
  })
  @ValidateIf((o) => o.type === 'fixed' && o.recurrence === 'monthly')
  @IsDate()
  @IsNotEmpty()
  recurrenceEndDate?: Date;
}
