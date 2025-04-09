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
import { v4 as uuidv4 } from 'uuid';

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
      recurrenceEndDate,
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

    let account: Account | undefined;
    let card: Card | undefined;

    if (accountId) {
      const foundAccount = await this.accountRepository.findOne({
        where: { id: accountId },
        relations: ['user'],
      });

      if (!foundAccount || foundAccount.user.id !== user.id) {
        throw new NotFoundException(
          'Account not found or does not belong to the user',
        );
      }

      account = foundAccount;
    }

    if (cardId) {
      const foundCard = await this.cardRepository.findOne({
        where: { id: cardId, user: { id: user.id } },
      });

      if (!foundCard) {
        throw new NotFoundException(
          'Card not found or does not belong to the user',
        );
      }

      card = foundCard;
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
      user,
      category,
      account,
      card,
    };

    // Installments
    if (type === 'installments') {
      const numberOfInstallments = installments ?? 1;
      const installmentValue = Number(
        (Number(amount) / numberOfInstallments).toFixed(2),
      );
      const groupId = uuidv4();
      const expenses: Expense[] = [];

      for (let i = 0; i < numberOfInstallments; i++) {
        const installmentDate = new Date(date);
        installmentDate.setMonth(installmentDate.getMonth() + i);

        const expense = this.expenseRepository.create({
          ...baseData,
          amount: installmentValue,
          date: installmentDate,
          type: 'fixed',
          recurrence: 'one-time',
          description: `${description} (${i + 1}/${numberOfInstallments})`,
          installmentNumber: i + 1,
          installmentTotal: numberOfInstallments,
          installmentGroupId: groupId,
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

    // Monthly recurrence
    if (type === 'fixed' && recurrence === 'monthly' && recurrenceEndDate) {
      const expenses: Expense[] = [];
      const recurrenceGroupId = uuidv4();

      const currentDate = new Date(date);
      const endDate = new Date(recurrenceEndDate);

      while (currentDate <= endDate) {
        const expense = this.expenseRepository.create({
          ...baseData,
          amount,
          date: new Date(currentDate),
          type: 'fixed',
          recurrence: 'one-time',
          recurrenceGroupId,
          recurrenceEndDate: endDate,
          description,
        });

        expenses.push(expense);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const saved = await this.expenseRepository.save(expenses);

      if (account) {
        account.balance -= Number(amount) * expenses.length;
        await this.accountRepository.save(account);
      }

      return saved;
    }

    // Regular one-time or fixed expense
    const expense = this.expenseRepository.create({
      ...baseData,
      amount,
      date,
      type,
      recurrence,
      description,
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
