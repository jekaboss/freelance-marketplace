import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @MinLength(6)
  passwordHash: string;

  @IsOptional()
  @IsIn(["client", "freelancer", "admin"])
  role?: "client" | "freelancer" | "admin";
}
