import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ROLE } from '../../users/interfaces/user.interface';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The name of the user',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The password of the user',
  })
  password: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    enum: [USER_ROLE],
    description: 'The role of the account',
  })
  role: 'admin' | 'borrower';
}
