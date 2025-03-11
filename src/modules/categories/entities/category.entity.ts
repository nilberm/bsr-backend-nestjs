import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @Column({ default: false })
  isDefault: boolean;
}
