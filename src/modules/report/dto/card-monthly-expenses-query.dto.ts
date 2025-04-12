import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CardMonthlyExpensesQueryDto {
  @ApiProperty({
    description: 'The UUID of the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  cardId: string;

  @ApiProperty({
    description: 'The month to filter (1 = January, 12 = December)',
    example: 4,
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'The year to filter',
    example: 2025,
  })
  @IsInt()
  year: number;
}
