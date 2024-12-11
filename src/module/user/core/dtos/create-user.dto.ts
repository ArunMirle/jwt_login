import { IsEmail, IsOptional, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @Min(1)
  @Max(120)
  age?: number;
}
