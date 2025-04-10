import { Expense } from 'src/modules/expenses/entities/expense.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  limit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentLimit: number;

  @Column({ type: 'int' })
  closingDay: number;

  @Column({ type: 'int' })
  dueDay: number;

  @OneToMany(() => Expense, (expense) => expense.card)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
