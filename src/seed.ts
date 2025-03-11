import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import {
  Category,
  CategoryType,
} from './modules/categories/entities/category.entity';

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food', type: CategoryType.EXPENSE },
  { name: 'Subscriptions & Services', type: CategoryType.EXPENSE },
  { name: 'Bars & Restaurants', type: CategoryType.EXPENSE },
  { name: 'Home', type: CategoryType.EXPENSE },
  { name: 'Shopping', type: CategoryType.EXPENSE },
  { name: 'Personal Care', type: CategoryType.EXPENSE },
  { name: 'Debts & Loans', type: CategoryType.EXPENSE },
  { name: 'Education', type: CategoryType.EXPENSE },
  { name: 'Family & Children', type: CategoryType.EXPENSE },
  { name: 'Taxes & Fees', type: CategoryType.EXPENSE },
  { name: 'Investments', type: CategoryType.EXPENSE },
  { name: 'Leisure & Hobbies', type: CategoryType.EXPENSE },
  { name: 'Supermarket', type: CategoryType.EXPENSE },
  { name: 'Others', type: CategoryType.EXPENSE },
  { name: 'Pets', type: CategoryType.EXPENSE },
  { name: 'Gifts & Donations', type: CategoryType.EXPENSE },
  { name: 'Clothing', type: CategoryType.EXPENSE },
  { name: 'Health', type: CategoryType.EXPENSE },
  { name: 'Work', type: CategoryType.EXPENSE },
  { name: 'Transport', type: CategoryType.EXPENSE },
  { name: 'Travel', type: CategoryType.EXPENSE },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Loans', type: CategoryType.INCOME },
  { name: 'Investments', type: CategoryType.INCOME },
  { name: 'Other Income', type: CategoryType.INCOME },
  { name: 'Salary', type: CategoryType.INCOME },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const categoryRepository = dataSource.getRepository(Category);

  for (const cat of [
    ...DEFAULT_EXPENSE_CATEGORIES,
    ...DEFAULT_INCOME_CATEGORIES,
  ]) {
    const exists = await categoryRepository.findOne({
      where: { name: cat.name, type: cat.type, isDefault: true },
    });

    if (!exists) {
      const newCategory = categoryRepository.create({
        ...cat,
        isDefault: true,
      });
      await categoryRepository.save(newCategory);
      console.log(`✅ Category ${cat.name} (${cat.type}) created!`);
    } else {
      console.log(`⚠️ Category ${cat.name} (${cat.type}) already exists.`);
    }
  }

  await app.close();
}

seed().catch((error) => {
  console.error('Error running seed:', error);
  process.exit(1);
});
