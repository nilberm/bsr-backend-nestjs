import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { Earning } from '../earning/entities/earning.entity';
import { Account } from '../accounts/entities/account.entity';
import { Card } from '../cards/entities/card.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async resetUserData(user: User): Promise<void> {
    await this.expenseRepository.delete({ user: { id: user.id } });
    await this.earningRepository.delete({ user: { id: user.id } });
    await this.accountRepository.delete({ user: { id: user.id } });
    await this.cardRepository.delete({ user: { id: user.id } });
  }
}
