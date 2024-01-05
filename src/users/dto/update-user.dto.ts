import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE } from '../interfaces/user.interface';

export class UpdateProfileDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'User name' })
  name?: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, description: 'User email' })
  email?: string;

  @IsString()
  @ApiProperty({ type: String, description: 'User role', enum: [USER_ROLE] })
  role?: string;
}
