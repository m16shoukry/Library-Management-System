import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GetBookDto } from '../../books/dto/get-book.dto';
import { GetUserProfileDto } from '../../users/dto/get-user.dto';
import { CHECKOUT_STATUS } from '../interfaces/checkout.interface';

export class GetCheckoutDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number,required:true, description: 'checkout id' })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The id of the user',
  })
  userId: number;

  @ApiProperty({
    type: GetUserProfileDto,
    required: true,
    description: 'User Details',
  })
  user: GetUserProfileDto;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The id of the book',
  })
  bookId: number;

  @ApiProperty({
    type: GetBookDto,
    required: true,
    description: 'Book Details',
  })
  book: GetBookDto;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The End Date of Borrow',
  })
  endBorrowDate: Date;

  @IsDateString()
  @ApiProperty({
    type: Date,
    required: false,
    description: 'The returned Date of Borrow',
  })
  returnedDate?: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The start Date of Borrow',
  })
  startBorrowDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'checkout status',
    enum: [CHECKOUT_STATUS],
  })
  status: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The updatedAt Date of checkout',
  })
  updatedAt: Date;
}
