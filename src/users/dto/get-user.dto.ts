import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { USER_ROLE } from '../interfaces/user.interface';

export class GetUserProfileDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'User id' })
  id: number;

  @IsString()
  @ApiProperty({ type: String, description: 'User name' })
  name: string;

  @IsString()
  @ApiProperty({ type: String, description: 'User email' })
  email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'User role', enum: [USER_ROLE] })
  role: string;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'User createdAt' })
  createdAt: Date;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'User updatedAt' })
  updatedAt: Date;
}
