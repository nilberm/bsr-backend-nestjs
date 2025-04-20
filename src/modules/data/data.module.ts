import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { Expense } from '../expenses/entities/expense.entity';
import { Earning } from '../earning/entities/earning.entity';
import { Account } from '../accounts/entities/account.entity';
import { Card } from '../cards/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Earning, Account, Card])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
