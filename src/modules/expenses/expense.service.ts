import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';
import { Card } from '../cards/entities/card.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user: User,
  ): Promise<Expense | Expense[]> {
    const {
      accountId,
      cardId,
      amount,
      categoryId,
      type,
      installments,
      recurrence,
      date,
      description,
    } = createExpenseDto;

    if (!accountId && !cardId) {
      throw new NotFoundException(
        'Either accountId or cardId must be provided.',
      );
    }

    if (accountId && cardId) {
      throw new NotFoundException(
        'Only one of accountId or cardId must be provided.',
      );
    }

    let account: Account | null = null;
    let card: Card | null = null;

    if (accountId) {
      account = await this.accountRepository.findOne({
        where: { id: accountId },
        relations: ['user'],
      });

      if (!account || account.user.id !== user.id) {
        throw new NotFoundException(
          'Account not found or does not belong to the user',
        );
      }
    }

    if (cardId) {
      card = await this.cardRepository.findOne({
        where: { id: cardId, user: { id: user.id } },
      });

      if (!card) {
        throw new NotFoundException(
          'Card not found or does not belong to the user',
        );
      }
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['user'],
    });

    if (!category || (!category.isDefault && category.user?.id !== user.id)) {
      throw new NotFoundException(
        'Category not found or does not belong to the user',
      );
    }

    const baseData: Partial<Expense> = {
      description,
      amount,
      date,
      user,
      category,
      type,
      recurrence,
    };

    if (account) baseData.account = account;
    if (card) baseData.card = card;

    if (type === 'installments') {
      const numberOfInstallments = installments ?? 1;
      const installmentValue = Number(
        (Number(amount) / numberOfInstallments).toFixed(2),
      );
      const expenses: Expense[] = [];

      for (let i = 0; i < numberOfInstallments; i++) {
        const installmentDate = new Date(date);
        installmentDate.setMonth(installmentDate.getMonth() + i);

        const expense = this.expenseRepository.create({
          ...baseData,
          amount: installmentValue,
          date: installmentDate,
          installments: numberOfInstallments,
        });

        expenses.push(expense);
      }

      const saved = await this.expenseRepository.save(expenses);

      if (account) {
        account.balance -= Number(amount);
        await this.accountRepository.save(account);
      }

      return saved;
    }

    const expense = this.expenseRepository.create({
      ...baseData,
      installments: undefined,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    if (account) {
      account.balance -= Number(amount);
      await this.accountRepository.save(account);
    }

    return savedExpense;
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
