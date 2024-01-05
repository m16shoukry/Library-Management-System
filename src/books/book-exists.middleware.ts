import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { BooksService } from './books.service';

@Injectable()
export class BookExistsMiddleware implements NestMiddleware {
  constructor(private readonly bookService: BooksService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id || +req.params.bookId;
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException('BOOK_NOT_FOUND');
    }
    next();
  }
}
