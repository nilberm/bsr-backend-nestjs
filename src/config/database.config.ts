import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from '../modules/accounts/entities/account.entity';
import { Card } from '../modules/cards/entities/card.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { User } from '../modules/users/entities/user.entity';
import { Expense } from 'src/modules/expenses/entities/expense.entity';
import { Earning } from 'src/modules/earning/entities/earning.entity';

export const databaseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [User, Account, Card, Category, Expense, Earning],
    autoLoadEntities: true,
    synchronize: true,
  }),
};
