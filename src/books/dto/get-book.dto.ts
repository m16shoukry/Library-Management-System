import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class GetBookDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, description: 'book id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The title of the book',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The author of the book',
  })
  author: string;

  @IsString()
  @IsNotEmpty()
  @IsISBN()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The ISBN of the book',
  })
  ISBN: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The quantity of the book',
  })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The shelf location of the book at the library',
  })
  shelf: string;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'User createdAt' })
  createdAt: Date;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'User updatedAt' })
  updatedAt: Date;
}
