import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '../../common/types/permission';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  age?: number;

  @IsEnum(UserType, { message: 'userType must be Admin or Channel Partner' })
userType: UserType;

  @IsOptional()
  @IsString()
  designation?: string;
}
