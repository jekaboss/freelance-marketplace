import { IsArray, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateFreelancerDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  bio?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
