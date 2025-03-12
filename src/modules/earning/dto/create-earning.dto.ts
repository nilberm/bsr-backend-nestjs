import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateEarningDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
