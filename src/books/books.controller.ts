import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { SwaggerApiDocumentation } from '../core/decorators/swagger-api-documentation.decorator';
import { CreateBookDto } from './dto/create-book.dto';
import { SuccessApiResponse } from '../core/dto/api-response/success-api-response.dto';
import { USER_ROLE } from '../users/interfaces/user.interface';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetBookDto } from './dto/get-book.dto';
import { PaginateDto } from '../core/dto/pagination/paginate-sort-dto';
import { PaginateResultDto } from '../core/dto/pagination/paginate-result-dto';
import { BaseApiResponse } from '../core/dto/api-response/base-api-response.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { GetUserProfileDto } from '../users/dto/get-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorators';

@Controller('books')
@ApiTags('books')
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  // **** admin create book details ****
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[Admin] Add Book Details',
    modelType: GetBookDto,
  })
  async create(@Body() createBookDto: CreateBookDto) {
    const newBook = await this.bookService.create(createBookDto);
    return new SuccessApiResponse<GetBookDto>(newBook);
  }

  // **** list all books details ****
  @Get('list')
  @UseGuards(JwtGuard)
  @SwaggerApiDocumentation({
    summary: 'Get Books List with pagination',
    modelType: GetBookDto,
    isArray: true,
    isPagination: true,
  })
  async findAllPaginated(
    @Query() paginateSortDto: PaginateDto,
  ): Promise<PaginateResultDto<GetBookDto>> {
    const booksList: PaginateResultDto<GetBookDto> =
      await this.bookService.findAllPaginated(paginateSortDto);
    return booksList;
  }

  @Get('borrowed')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.BORROWER)
  @SwaggerApiDocumentation({
    summary: '[Borrower] list Books Currently have borrowed',
    modelType: GetBookDto,
    isArray: true,
    isPagination: true,
  })
  async listUserBorrowedBooks(
    @GetUser() user: GetUserProfileDto,
    @Query() paginateSortDto: PaginateDto,
  ): Promise<PaginateResultDto<GetBookDto>> {
    const bookList = await this.bookService.findAllBorrowedByUser(
      user.id,
      paginateSortDto,
    );
    return bookList;
  }

  // **** list overdue books ****
  @Get('overdue')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[ADMIN] Get Overdue Books List',
    modelType: GetBookDto,
    isArray: true,
    isPagination: true,
  })
  async listOverdueBooks(
    @Query() paginateSortDto: PaginateDto,
  ): Promise<PaginateResultDto<GetBookDto>> {
    const overdueBooksList: PaginateResultDto<GetBookDto> =
      await this.bookService.listOverdueBooks(paginateSortDto);
    return overdueBooksList;
  }

  @Get('search')
  @UseGuards(JwtGuard)
  @SwaggerApiDocumentation({
    summary: 'Search Books List',
    modelType: GetBookDto,
    isArray: true,
  })
  async search(
    @Query() searchBookDto: SearchBookDto,
  ): Promise<BaseApiResponse<GetBookDto[]>> {
    const results = await this.bookService.search(searchBookDto);
    return new SuccessApiResponse<GetBookDto[]>(results);
  }

  // **** Update Book Details ****
  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[Admin] Update Book Details',
    modelType: GetBookDto,
  })
  async update(
    @Param('id') bookId: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BaseApiResponse<GetBookDto>> {
    const bookDetails = await this.bookService.update(bookId, updateBookDto);
    return new SuccessApiResponse<GetBookDto>(bookDetails);
  }

  // **** Deleta One Book ****
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: '[Admin] Delete one Book by id',
    modelType: Object,
  })
  async delete(@Param('id') bookId: number): Promise<BaseApiResponse<void>> {
    await this.bookService.delete(bookId);
    return new SuccessApiResponse<void>(null, 'DELETED SUCCESSFULLY');
  }
}
