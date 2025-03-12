import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiPropertyOptional({
    description: 'The name of the card',
    example: 'My Updated Credit Card',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The credit limit of the card',
    example: 7000,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'The closing day of the card billing cycle (1-31)',
    example: 10,
    minimum: 1,
    maximum: 31,
  })
  closingDay?: number;

  @ApiPropertyOptional({
    description: 'The due day of the card billing cycle (1-31)',
    example: 25,
    minimum: 1,
    maximum: 31,
  })
  dueDay?: number;
}
