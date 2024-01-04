import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE } from '../interfaces/user.interface';

export class UpdateProfileDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'User name', required: true })
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'User email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'User role', enum: [USER_ROLE] })
  role: USER_ROLE;
}
