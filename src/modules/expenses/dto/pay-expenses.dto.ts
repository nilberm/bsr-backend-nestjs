import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, ArrayNotEmpty, IsArray } from 'class-validator';

export class PayExpensesDto {
  @ApiProperty({
    description: 'List of expense UUIDs to mark as paid',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  expenseIds: string[];
}
