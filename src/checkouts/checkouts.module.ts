import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './checkouts.service';
import { UserModule } from '../users/user.module';
import { Book } from '../books/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CheckOut } from './checkouts.entity';
import { BooksModule } from '../books/books.module';
import { BookExistsMiddleware } from '../books/book-exists.middleware';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, User, CheckOut]),
    UserModule,
    BooksModule,
  ],
  controllers: [CheckoutsController],
  providers: [CheckoutsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }],
  exports: [CheckoutsService],
})
export class CheckoutsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BookExistsMiddleware)
      .forRoutes(
        { path: 'checkout/borrow/:bookId', method: RequestMethod.POST },
        { path: 'checkout/return/:bookId', method: RequestMethod.PUT },
      );
  }
}
