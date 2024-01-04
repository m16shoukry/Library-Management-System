import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Like, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { PaginateResultDto } from '../core/dto/pagination/paginate-result-dto';
import { PaginateDto } from '../core/dto/pagination/paginate-sort-dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book';

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

  // **** Update One Book ****
  async update(
    bookId: number,
    updateBookDto: UpdateBookDto,
  ): Promise<GetBookDto> {
    await this.bookRepository.update(bookId, updateBookDto);
    const bookDetails = await this.bookRepository.findOneBy({ id: bookId });
    return bookDetails;
  }

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
}
