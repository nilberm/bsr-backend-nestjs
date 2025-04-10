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
import { Card } from 'src/modules/cards/entities/card.entity';

export type ExpenseType = 'fixed' | 'installments';
export type ExpenseRecurrence = 'one-time' | 'monthly';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.expenses, { eager: true })
  user: User;

  @ManyToOne(() => Account, (account) => account.expenses, {
    eager: true,
    nullable: true,
  })
  account?: Account;

  @ManyToOne(() => Card, (card) => card.expenses, {
    eager: true,
    nullable: true,
  })
  card?: Card;

  @ManyToOne(() => Category, (category) => category.expenses, { eager: true })
  category: Category;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'enum', enum: ['fixed', 'installments'] })
  type: ExpenseType;

  @Column({
    type: 'enum',
    enum: ['one-time', 'monthly'],
    default: 'one-time',
    nullable: true,
  })
  recurrence?: ExpenseRecurrence;

  @Column({ type: 'uuid', nullable: true })
  recurrenceGroupId?: string;

  @Column({ type: 'timestamp', nullable: true })
  recurrenceEndDate?: Date;

  @Column({ type: 'int', nullable: true })
  installmentNumber?: number;

  @Column({ type: 'int', nullable: true })
  installmentTotal?: number;

  @Column({ type: 'uuid', nullable: true })
  installmentGroupId?: string;

  @Column({ default: false })
  isPaid: boolean;
}
