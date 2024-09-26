import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class BaseDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsDateString()
  created_at: Date;

  @IsOptional()
  @IsDateString()
  updated_at: Date;

  @IsOptional()
  @IsNumber()
  created_by: number;

  @IsOptional()
  @IsNumber()
  updated_by: number;
}
