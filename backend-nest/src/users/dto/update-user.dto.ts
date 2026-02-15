import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  passwordHash?: string;

  @IsOptional()
  @IsIn(["client", "freelancer", "admin"])
  role?: "client" | "freelancer" | "admin";
}
