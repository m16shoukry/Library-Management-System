import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CheckOut } from '../checkouts/checkouts.entity';
import { User } from '../users/user.entity';
import { Book } from '../books/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { CheckoutsModule } from '../checkouts/checkouts.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ValidateDatesMiddleware } from './validateDates.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, User, CheckOut]),
    UserModule,
    CheckoutsModule,
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ReportsService],
})
export class ReportsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateDatesMiddleware)
      .forRoutes(
        { path: 'reports/period', method: RequestMethod.GET },
      );
  }
}
