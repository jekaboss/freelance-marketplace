import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsNumber()
  clientId: number;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsNumber()
  budget?: number;
}
