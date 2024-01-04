import { CheckOut } from 'src/checkouts/checkouts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  @Index({ unique: true })
  ISBN: string;

  @Column()
  @Index()
  title: string;

  @Column()
  quantity: number;

  @Column()
  @Index()
  author: string;

  @Column()
  shelf: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => CheckOut, (checkout) => checkout.book)
  checkouts: CheckOut[];
}
