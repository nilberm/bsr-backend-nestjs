import {
  BadRequestException,
  ForbiddenException,
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

  async findAll(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(accountId: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    userId: string,
  ): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this account',
      );
    }

    await this.accountRepository.update(id, updateAccountDto);

    return this.findOne(id, userId);
  }

  async remove(accountId: string, userId: string): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this account',
      );
    }

    if (account.isDefault) {
      throw new BadRequestException('Default account cannot be deleted');
    }

    await this.accountRepository.remove(account);
  }

  async updateBalance(
    accountId: string,
    balance: number,
    userId: string,
  ): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this account',
      );
    }

    account.balance = balance;
    return this.accountRepository.save(account);
  }
}
