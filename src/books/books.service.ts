import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Like, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { PaginateResultDto } from '../core/dto/pagination/paginate-result-dto';
import { PaginateDto } from '../core/dto/pagination/paginate-sort-dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { CHECKOUT_STATUS } from '../checkouts/interfaces/checkout.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<GetBookDto> {
    const newBook = this.bookRepository.create({
      ...createBookDto,
    });
    await this.bookRepository.save(newBook);

    return newBook;
  }

  async findAllPaginated(
    basePaginateDto: PaginateDto,
  ): Promise<PaginateResultDto<GetBookDto>> {
    const { pageNumber, pageSize, sort, sortOrder } = basePaginateDto;

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const [data, count] = await this.bookRepository.findAndCount({
      order: {
        [sort]: sortOrder,
      },
      skip,
      take,
    });

    const totalPages = Math.ceil(count / pageSize);

    return new PaginateResultDto<GetBookDto>(
      data,
      count,
      pageNumber,
      pageSize,
      totalPages,
    );
  }

  // **** Get book by id ****
  async findById(id: number): Promise<GetBookDto> {
    return await this.bookRepository.findOneBy({ id });
  }

  // **** Update One Book ****
  async update(id: number, updateBookDto: UpdateBookDto): Promise<GetBookDto> {
    await this.bookRepository.update(id, { ...updateBookDto });
    const bookDetails = await this.findById(id);
    return bookDetails;
  }

  // **** search book by title/author/ISBN ****
  async search(query: SearchBookDto): Promise<GetBookDto[]> {
    const { title, author, ISBN } = query;
    return await this.bookRepository.find({
      where: [
        { title: Like(`%${title}%`) },
        { author: Like(`%${author}%`) },
        { ISBN: Like(`%${ISBN}%`) },
      ],
    });
  }

  // **** Delete One Book ****
  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }

  // **** validate available Book quantity  ****
  async validateQuantityAndRetrun(bookId: number): Promise<GetBookDto> {
    const book = await this.findById(bookId);
    if (!book || book.quantity === 0) {
      throw new NotFoundException('not available quantity for this book');
    }
    return book;
  }

  async findAllBorrowedByUser(
    userId: number,
    basePaginateDto: PaginateDto,
  ): Promise<PaginateResultDto<GetBookDto>> {
    const { pageNumber, pageSize, sort, sortOrder } = basePaginateDto;

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const [data, count] = await this.bookRepository
      .createQueryBuilder('books')
      .leftJoinAndSelect('books.checkouts', 'checkouts')
      .where('checkouts.userId = :userId', { userId })
      .andWhere('checkouts.status = :status', {
        status: CHECKOUT_STATUS.BORROWED,
      })
      .andWhere('checkouts.returnedDate IS NULL')
      .orderBy(`checkouts.${sort}`, sortOrder)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const totalPages = Math.ceil(count / pageSize);

    return new PaginateResultDto<GetBookDto>(
      data,
      count,
      pageNumber,
      pageSize,
      totalPages,
    );
  }
}
