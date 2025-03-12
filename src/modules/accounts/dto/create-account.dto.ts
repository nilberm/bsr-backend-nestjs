import { IsNotEmpty, IsString, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The UUID of the user who owns the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The name of the account',
    example: 'Savings Account',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The initial balance of the account',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  initialBalance: number;
}
