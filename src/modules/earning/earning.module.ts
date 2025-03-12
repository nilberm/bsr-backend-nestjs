import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningService } from './earning.service';
import { EarningController } from './earning.controller';
import { Earning } from './entities/earning.entity';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Earning, Account, Category])],
  controllers: [EarningController],
  providers: [EarningService],
})
export class EarningModule {}
