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
      where: { id: createEarningDto.categoryId, user: { id: user.id } },
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

    return this.earningRepository.save(earning);
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
    const updatedEarning = Object.assign(earning, updateEarningDto);
    return this.earningRepository.save(updatedEarning);
  }

  async remove(id: string, user: User): Promise<void> {
    const earning = await this.findOne(id, user);
    await this.earningRepository.remove(earning);
  }
}
