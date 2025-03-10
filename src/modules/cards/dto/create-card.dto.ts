import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCardDto {
  @IsString()
  name: string;

  @IsNumber()
  limit: number;

  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;
}
