import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Earning } from './entities/earning.entity';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class EarningService {
  constructor(
    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createEarningDto: CreateEarningDto,
    user: User,
  ): Promise<Earning> {
    const account = await this.accountRepository.findOne({
      where: { id: createEarningDto.accountId, user: { id: user.id } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const category = await this.categoryRepository.findOne({
      where: [
        { id: createEarningDto.categoryId, user: { id: user.id } },
        { id: createEarningDto.categoryId, isDefault: true },
      ],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const earning = this.earningRepository.create({
      description: createEarningDto.description,
      amount: createEarningDto.amount,
      date: createEarningDto.date ? new Date(createEarningDto.date) : undefined,
      user,
      account,
      category,
    });

    const savedEarning = await this.earningRepository.save(earning);

    account.balance += Number(createEarningDto.amount);
    await this.accountRepository.save(account);

    return savedEarning;
  }

  async findAll(user: User): Promise<Earning[]> {
    return this.earningRepository.find({
      where: { user: { id: user.id } },
      relations: ['account', 'category'],
    });
  }

  async findOne(id: string, user: User): Promise<Earning> {
    const earning = await this.earningRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['account', 'category'],
    });

    if (!earning) {
      throw new NotFoundException('Earning not found');
    }

    return earning;
  }

  async update(
    id: string,
    updateEarningDto: UpdateEarningDto,
    user: User,
  ): Promise<Earning> {
    const earning = await this.findOne(id, user);

    const oldAmount = Number(earning.amount);
    const oldAccount = earning.account;

    let newAccount: Account | null = oldAccount;
    if (
      updateEarningDto.accountId &&
      updateEarningDto.accountId !== oldAccount.id
    ) {
      newAccount = await this.accountRepository.findOne({
        where: { id: updateEarningDto.accountId, user: { id: user.id } },
      });

      if (!newAccount) {
        throw new NotFoundException('New account not found');
      }
    }

    // Atualiza valores
    Object.assign(earning, updateEarningDto);
    if (updateEarningDto.date) {
      earning.date = new Date(updateEarningDto.date);
    }

    earning.account = newAccount;

    const updatedEarning = await this.earningRepository.save(earning);

    if (oldAccount.id === newAccount.id) {
      const newAmount = Number(updateEarningDto.amount ?? oldAmount);
      oldAccount.balance += newAmount - oldAmount;
      await this.accountRepository.save(oldAccount);
    } else {
      oldAccount.balance -= oldAmount;
      newAccount.balance += Number(updateEarningDto.amount ?? 0);
      await this.accountRepository.save([oldAccount, newAccount]);
    }

    return updatedEarning;
  }

  async remove(id: string, user: User): Promise<void> {
    const earning = await this.findOne(id, user);
    const account = earning.account;

    account.balance -= Number(earning.amount);
    await this.accountRepository.save(account);

    await this.earningRepository.remove(earning);
  }
}
