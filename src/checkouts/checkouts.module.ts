import { Module } from '@nestjs/common';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './checkouts.service';
import { UserModule } from '../users/user.module';
import { Book } from '../books/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CheckOut } from './checkouts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, CheckOut]), UserModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
  exports: [CheckoutsService],
})
export class CheckoutsModule {}
