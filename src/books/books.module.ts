import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { BookExistsMiddleware } from './book-exists.middleware';
import { CheckOut } from 'src/checkouts/checkouts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, CheckOut]), UserModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BookExistsMiddleware)
      .forRoutes(
        { path: 'books/:id', method: RequestMethod.PUT },
        { path: 'books/:id', method: RequestMethod.DELETE },
      );
  }
}
