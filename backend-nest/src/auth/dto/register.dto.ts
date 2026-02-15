import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(["client", "freelancer", "admin"])
  role: "client" | "freelancer" | "admin";
}
