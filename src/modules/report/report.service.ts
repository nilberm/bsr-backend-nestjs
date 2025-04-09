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

    const [expenses, earnings] = await Promise.all([
      this.expenseRepository.find({
        where: {
          user: { id: user.id },
          date: Between(startOfMonth, endOfMonth),
        },
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

    const expenseTransactions = expenses.map((e) => ({
      id: e.id,
      type: 'expense',
      description: e.description,
      amount: Number(e.amount),
      date: e.date,
      category: {
        id: e.category?.id,
        name: e.category?.name,
      },
      account: e.account
        ? { id: e.account.id, name: e.account.name }
        : undefined,
      card: e.card ? { id: e.card.id, name: e.card.name } : undefined,
      installmentInfo:
        e.installmentNumber && e.installmentTotal
          ? `${e.installmentNumber}/${e.installmentTotal}`
          : undefined,
    }));

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

    const transactions = [...expenseTransactions, ...earningTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalEarnings = earningTransactions.reduce(
      (sum, e) => sum + e.amount,
      0,
    );
    const totalExpenses = expenseTransactions.reduce(
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
