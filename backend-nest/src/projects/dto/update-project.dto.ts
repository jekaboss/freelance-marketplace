import { IsIn, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsIn(["open", "in_progress", "completed"])
  status?: "open" | "in_progress" | "completed";
}
