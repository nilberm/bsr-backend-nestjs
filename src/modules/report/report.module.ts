import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Expense } from '../expenses/entities/expense.entity';
import { Earning } from '../earning/entities/earning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Earning])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
