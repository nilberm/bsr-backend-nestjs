import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CardModule } from './modules/cards/card.module';
import { CategoryModule } from './modules/categories/category.module';
import { ExpenseModule } from './modules/expenses/expense.module';
import { EarningModule } from './modules/earning/earning.module';
import { ReportModule } from './modules/report/report.module';
import { DataModule } from './modules/data/data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    AuthModule,
    AccountsModule,
    CardModule,
    CategoryModule,
    ExpenseModule,
    EarningModule,
    ReportModule,
    DataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
