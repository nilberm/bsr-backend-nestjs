import { IsNotEmpty, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  initialBalance: number;
}
