import { Book } from '../books/books.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CHECKOUT_STATUS } from './interfaces/checkout.interface';

@Entity({ name: 'checkouts' })
export class CheckOut {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  userId: number;

  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @ManyToOne(() => User, (user) => user.checkouts, {
    eager: true,
  })
  user: User;

  @Column()
  bookId: number;

  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  @ManyToOne(() => Book, (book) => book.checkouts, {
    eager: true,
  })
  book: Book;

  @Column({ type: 'enum', enum: CHECKOUT_STATUS })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startBorrowDate: Date;

  @Column({ type: 'timestamp' })
  endBorrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedDate: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
