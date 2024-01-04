import { IsISBN, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBookDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The title of the book',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The author of the book',
  })
  author?: string;

  @IsString()
  @IsOptional()
  @IsISBN()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The ISBN of the book',
  })
  ISBN?: string;
}
