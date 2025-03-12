import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'The new name of the account (optional)',
    example: 'Checking Account',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The new initial balance of the account (optional)',
    example: 1500,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;
}
