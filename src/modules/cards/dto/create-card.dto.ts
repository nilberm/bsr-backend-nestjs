import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    description: 'The name of the card',
    example: 'My Credit Card',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The credit limit of the card',
    example: 5000,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'The closing day of the card billing cycle (1-31)',
    example: 15,
    minimum: 1,
    maximum: 31,
  })
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @ApiProperty({
    description: 'The due day of the card billing cycle (1-31)',
    example: 20,
    minimum: 1,
    maximum: 31,
  })
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}
