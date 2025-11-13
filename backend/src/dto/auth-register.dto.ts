import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';
export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['STUDENT','CREATOR'])
  role?: string;
}
