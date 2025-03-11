import { IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsBoolean()
  readonly isDefault: boolean = false;
}
