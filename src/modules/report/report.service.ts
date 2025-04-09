import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { Earning } from '../earning/entities/earning.entity';
import { User } from '../users/entities/user.entity';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

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

  async getReportRange(user: User) {
    const [firstExpense] = await this.expenseRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'ASC' },
      take: 1,
    });

    const [firstEarning] = await this.earningRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'ASC' },
      take: 1,
    });

    const [lastExpense] = await this.expenseRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'DESC' },
      take: 1,
    });

    const [lastEarning] = await this.earningRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'DESC' },
      take: 1,
    });

    const now = dayjs();

    const firstExpenseDate = dayjs(
      firstExpense?.date as Date | string | undefined,
    );
    const firstEarningDate = dayjs(
      firstEarning?.date as Date | string | undefined,
    );
    const lastExpenseDate = dayjs(
      lastExpense?.date as Date | string | undefined,
    );
    const lastEarningDate = dayjs(
      lastEarning?.date as Date | string | undefined,
    );

    const firstDate = dayjs.min(firstExpenseDate, firstEarningDate).isValid()
      ? dayjs.min(firstExpenseDate, firstEarningDate).startOf('month')
      : now.startOf('month');

    const lastDate = dayjs.max(lastExpenseDate, lastEarningDate).isValid()
      ? dayjs.max(lastExpenseDate, lastEarningDate).endOf('month')
      : now.add(1, 'month').endOf('month');

    return {
      start: firstDate.isAfter(now)
        ? now.startOf('month').toISOString()
        : firstDate.toISOString(),
      end: lastDate.isBefore(now)
        ? now.add(1, 'month').endOf('month').toISOString()
        : lastDate.toISOString(),
    };
  }
}
