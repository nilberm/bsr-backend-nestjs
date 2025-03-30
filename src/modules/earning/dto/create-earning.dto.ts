import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEarningDto {
  @ApiProperty({
    description: 'The description of the earning',
    example: 'Freelance Project Payment',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The amount of the earning',
    example: 1500.75,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The UUID of the account associated with the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({
    description: 'The UUID of the category associated with the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'The date of the earning',
    example: '2025-03-30T14:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}
