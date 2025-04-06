import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class MonthlyReportQueryDto {
  @ApiProperty({
    description: 'Month of the report (1 = January, 12 = December)',
    example: 5,
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Year of the report',
    example: 2025,
  })
  @IsInt()
  year: number;
}
