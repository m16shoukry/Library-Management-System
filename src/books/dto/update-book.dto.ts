import { ApiProperty } from '@nestjs/swagger';
import {
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The title of the book',
  })
  title?: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The name of the book',
  })
  author?: string;

  @IsString()
  @IsISBN()
  @ApiProperty({
    type: String,
    description: 'The ISBN of the book',
  })
  ISBN?: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The quantity of the book',
  })
  quantity?: number;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The shelf location of the book at the library',
  })
  shelf?: string;
}
