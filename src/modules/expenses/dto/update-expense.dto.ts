import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
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
    description: 'The UUID of the card associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsOptional()
  cardId?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the category associated with the expense',
    example: '123e4567-e89b-12d3-a456-426614174002',
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

  @ApiPropertyOptional({
    description: 'The type of the expense',
    example: 'fixed',
    enum: ['fixed', 'installments'],
  })
  @IsEnum(['fixed', 'installments'])
  @IsOptional()
  type?: 'fixed' | 'installments';

  @ApiPropertyOptional({
    description: 'Number of installments (only for installment expenses)',
    example: 6,
  })
  @ValidateIf((o: UpdateExpenseDto) => o.type === 'installments')
  @IsNumber()
  @IsOptional()
  installments?: number;

  @ApiPropertyOptional({
    description: 'Recurrence of the fixed expense',
    example: 'monthly',
    enum: ['one-time', 'monthly'],
  })
  @ValidateIf((o: UpdateExpenseDto) => o.type === 'fixed')
  @IsIn(['one-time', 'monthly'])
  @IsOptional()
  recurrence?: 'one-time' | 'monthly';

  @ApiPropertyOptional({
    description: 'End date of the recurrence (only for monthly recurrence)',
    example: '2025-12-31',
  })
  @ValidateIf(
    (o: UpdateExpenseDto) => o.type === 'fixed' && o.recurrence === 'monthly',
  )
  @IsDate()
  @IsOptional()
  recurrenceEndDate?: Date;
}
