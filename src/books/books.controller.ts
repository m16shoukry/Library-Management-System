import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@Controller('books')
@ApiTags('books')
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  // **** admin create book details ****
  @Post('create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: 'Admin Add Book Details',
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

  // **** Update Book Details ****
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  @SwaggerApiDocumentation({
    summary: 'Admin Update Book Details',
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
    summary: 'Admin Delete one Book by id',
    modelType: Object,
  })
  async delete(@Param('id') bookId: number): Promise<BaseApiResponse<void>> {
    await this.bookService.delete(bookId);
    return new SuccessApiResponse<void>(null, 'DELETED SUCCESSFULLY');
  }
}
