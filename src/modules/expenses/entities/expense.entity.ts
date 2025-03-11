import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.expenses, { eager: true })
  user: User;

  @ManyToOne(() => Account, (account) => account.expenses, { eager: true })
  account: Account;

  @ManyToOne(() => Category, (category) => category.expenses, { eager: true })
  category: Category;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  date: Date;
}
