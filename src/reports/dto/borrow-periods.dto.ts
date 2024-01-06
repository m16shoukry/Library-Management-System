import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class PeriodOfBorrowsDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The start Date of require Period',
  })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'The end Date of require Period',
  })
  endDate: Date;
}
