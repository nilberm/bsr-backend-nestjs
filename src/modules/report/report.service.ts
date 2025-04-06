import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Expense } from '../expenses/entities/expense.entity';
import { Earning } from '../earning/entities/earning.entity';
import { User } from '../users/entities/user.entity';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,
  ) {}

  async getMonthlyReport(
    user: User,
    query: MonthlyReportQueryDto,
  ): Promise<any> {
    const { month, year } = query;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const [allExpenses, earnings] = await Promise.all([
      this.expenseRepository.find({
        where: { user: { id: user.id } },
        relations: ['category', 'account', 'card'],
      }),
      this.earningRepository.find({
        where: {
          user: { id: user.id },
          date: Between(startOfMonth, endOfMonth),
        },
        relations: ['category', 'account'],
      }),
    ]);

    const filteredExpenses = allExpenses
      .map((expense) => {
        if (expense.type === 'installments' && expense.installments) {
          const installmentStart = new Date(expense.date);
          const current = new Date(startOfMonth);
          current.setHours(0, 0, 0, 0);

          const diff =
            (current.getFullYear() - installmentStart.getFullYear()) * 12 +
            (current.getMonth() - installmentStart.getMonth());

          if (diff >= 0 && diff < expense.installments) {
            return {
              id: expense.id,
              type: 'expense',
              description: expense.description,
              amount: Number(
                (Number(expense.amount) / expense.installments).toFixed(2),
              ),
              date: startOfMonth,
              category: {
                id: expense.category?.id,
                name: expense.category?.name,
              },
              account: expense.account
                ? { id: expense.account.id, name: expense.account.name }
                : undefined,
              card: expense.card
                ? { id: expense.card.id, name: expense.card.name }
                : undefined,
              installmentInfo: `${diff + 1}/${expense.installments}`,
            };
          }

          return null;
        }

        const expenseDate = new Date(expense.date);
        if (expenseDate >= startOfMonth && expenseDate <= endOfMonth) {
          return {
            id: expense.id,
            type: 'expense',
            description: expense.description,
            amount: Number(expense.amount),
            date: expense.date,
            category: {
              id: expense.category?.id,
              name: expense.category?.name,
            },
            account: expense.account
              ? { id: expense.account.id, name: expense.account.name }
              : undefined,
            card: expense.card
              ? { id: expense.card.id, name: expense.card.name }
              : undefined,
          };
        }

        return null;
      })
      .filter((e) => e !== null);

    const earningTransactions = earnings.map((e) => ({
      id: e.id,
      type: 'earning',
      description: e.description,
      amount: Number(e.amount),
      date: e.date,
      category: {
        id: e.category?.id,
        name: e.category?.name,
      },
      account: e.account
        ? {
            id: e.account.id,
            name: e.account.name,
          }
        : undefined,
    }));

    const transactions = [...filteredExpenses, ...earningTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalEarnings = earningTransactions.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    const totalExpenses = filteredExpenses.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    const balance = totalEarnings - totalExpenses;

    return {
      totalEarnings,
      totalExpenses,
      balance,
      transactions,
    };
  }
}
