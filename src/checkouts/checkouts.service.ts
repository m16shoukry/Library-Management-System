import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckOut } from './checkouts.entity';
import { CHECKOUT_STATUS } from './interfaces/checkout.interface';
import { GetCheckoutDetailsDto } from './dto/get-checkout.dto';
import { BooksService } from '../books/books.service';
import { ErrorApiResponse } from '../core/dto/api-response/Error-api-response.dto';
import * as moment from 'moment';
import { calculateEndBorrowDate } from './utils/BorrowDate';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(CheckOut)
    private readonly checkoutRepository: Repository<CheckOut>,
    private readonly bookService: BooksService,
  ) {}

  async borrowBook(
    userId: number,
    bookId: number,
  ): Promise<GetCheckoutDetailsDto> {
  
    // check if still borrowed same book by same user
    const isBorrowed = await this.getOneBorrowed(userId, bookId);

    if (isBorrowed) {
      throw new ErrorApiResponse('sorry, you have already borrowed this book');
    }

    const newBorrow = this.checkoutRepository.create({
      bookId,
      userId,
      status: CHECKOUT_STATUS.BORROWED,
      endBorrowDate: calculateEndBorrowDate(),
    });
    await this.checkoutRepository.save(newBorrow);

    const book = await this.bookService.validateQuantityAndRetrun(bookId);
    await this.bookService.update(bookId, {
      quantity: book.quantity - 1,
    });

    return newBorrow;
  }

  async returnBook(
    userId: number,
    bookId: number,
  ): Promise<GetCheckoutDetailsDto> {
    const currentDate = moment().toDate();

    await this.checkoutRepository.update(
      { userId, bookId },
      { returnedDate: currentDate, status: CHECKOUT_STATUS.RETURNED },
    );

    const book = await this.bookService.findById(bookId);
    await this.bookService.update(bookId, {
      quantity: book.quantity + 1,
    });

    return await this.checkoutRepository.findOneBy({ userId, bookId });
  }

  // *** get already borrowed one book by same user ***
  async getOneBorrowed(
    userId: number,
    bookId: number,
  ): Promise<GetCheckoutDetailsDto | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        userId: userId,
        bookId: bookId,
        status: CHECKOUT_STATUS.BORROWED,
        returnedDate: null,
      },
    });

    return checkout;
  }
}
