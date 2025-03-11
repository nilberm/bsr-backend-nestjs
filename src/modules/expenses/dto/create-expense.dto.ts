export class CreateExpenseDto {
  accountId: string;
  categoryId: string;
  amount: number;
  description?: string;
  date: Date;
}
