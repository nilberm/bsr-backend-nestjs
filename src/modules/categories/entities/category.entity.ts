import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expense } from 'src/modules/expenses/entities/expense.entity';
import { Earning } from 'src/modules/earning/entities/earning.entity';

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user: User | null;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @OneToMany(() => Earning, (earning) => earning.category)
  earnings: Earning[];

  @Column({ default: false })
  isDefault: boolean;
}
