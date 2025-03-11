import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user: User,
  ): Promise<Expense> {
    const account = await this.accountRepository.findOne({
      where: { id: createExpenseDto.accountId },
      relations: ['user'],
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (!account.user || account.user.id !== user.id) {
      throw new NotFoundException('Account does not belong to the user');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: createExpenseDto.categoryId },
      relations: ['user'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (
      !category.isDefault &&
      (!category.user || category.user.id !== user.id)
    ) {
      throw new NotFoundException('Category does not belong to the user');
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user,
      account,
      category,
    });
    return this.expenseRepository.save(expense);
  }

  async findAll(user: User): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: user.id } },
      relations: ['account', 'category'],
    });
  }

  async findOne(id: string, user: User): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['account', 'category'],
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    user: User,
  ): Promise<Expense> {
    const expense = await this.findOne(id, user);
    const updatedExpense = Object.assign(expense, updateExpenseDto);
    return this.expenseRepository.save(updatedExpense);
  }

  async remove(id: string, user: User): Promise<void> {
    const expense = await this.findOne(id, user);
    await this.expenseRepository.remove(expense);
  }
}
