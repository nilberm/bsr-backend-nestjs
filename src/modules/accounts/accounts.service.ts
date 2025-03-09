import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findOne(id: string): Promise<Account | null> {
    return this.accountRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    await this.accountRepository.update(id, updateAccountDto);

    const updatedAccount = await this.findOne(id);
    if (!updatedAccount) {
      throw new Error('Account not found');
    }

    return updatedAccount;
  }

  async remove(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
