import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsDate, Matches } from 'class-validator';
import { Account } from '../../accounts/entities/account.entity';
import { Card } from '../../cards/entities/card.entity';
import { Category } from '../../categories/entities/category.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Matches(/^\d{8}$/, { message: 'Password must be exactly 8 digits' })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'date' })
  @IsDate({ message: 'Date of birth must be a valid date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts: Account[];

  @OneToMany(() => Card, (card) => card.user, { cascade: true })
  cards: Card[];

  @OneToMany(() => Category, (category) => category.user, { cascade: true })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
