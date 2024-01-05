import { Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckoutsService } from './checkouts.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SwaggerApiDocumentation } from '../core/decorators/swagger-api-documentation.decorator';
import { SuccessApiResponse } from '../core/dto/api-response/success-api-response.dto';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { USER_ROLE } from '../users/interfaces/user.interface';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetCheckoutDetailsDto } from './dto/get-checkout.dto';
import { BaseApiResponse } from '../core/dto/api-response/base-api-response.dto';
import { GetUserProfileDto } from '../users/dto/get-user.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('checkout')
@ApiTags('checkout')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard, ThrottlerGuard) // here used rate limit guard
@Roles(USER_ROLE.BORROWER)
export class CheckoutsController {
  constructor(private readonly checkoutService: CheckoutsService) {}

  // **** borrow one book ****
  @Post('borrow/:bookId')
  @SwaggerApiDocumentation({
    summary: '[Borrower] Borrow One Book',
    modelType: GetCheckoutDetailsDto,
  })
  async borrowBook(
    @GetUser() user: GetUserProfileDto,
    @Param('bookId') bookId: number,
  ): Promise<BaseApiResponse<GetCheckoutDetailsDto>> {
    const newCheckout = await this.checkoutService.borrowBook(user.id, bookId);
    return new SuccessApiResponse<GetCheckoutDetailsDto>(
      newCheckout,
      'BOOK BORROWED SUCCESSFULLY',
    );
  }

  // **** return one book ****
  @Put('return/:bookId')
  @SwaggerApiDocumentation({
    summary: '[Borrower] Retrun Borrowed Book',
    modelType: GetCheckoutDetailsDto,
  })
  async returnBook(
    @GetUser() user: GetUserProfileDto,
    @Param('bookId') bookId: number,
  ): Promise<BaseApiResponse<GetCheckoutDetailsDto>> {
    const returnedDetails = await this.checkoutService.returnBook(
      user.id,
      bookId,
    );
    return new SuccessApiResponse<GetCheckoutDetailsDto>(
      returnedDetails,
      'BOOK RETURNED SUCCESSFULLY',
    );
  }
}
