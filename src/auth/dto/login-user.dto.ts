import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'user email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The password of the user',
  })
  password: string;
}
