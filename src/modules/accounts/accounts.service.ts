import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    const accountsCount = await this.accountRepository.count({
      where: { user: { id: user.id } },
    });

    if (accountsCount >= 10) {
      throw new BadRequestException('You can only have up to 10 accounts');
    }

    const account = this.accountRepository.create({
      ...createAccountDto,
      user,
    });

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

  async remove(accountId: string, user: User): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: user.id } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.isDefault) {
      throw new BadRequestException('Default account cannot be deleted');
    }

    await this.accountRepository.remove(account);
  }
}
