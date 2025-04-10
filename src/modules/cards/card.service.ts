import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto, user: User): Promise<Card> {
    const card = this.cardRepository.create({
      ...createCardDto,
      currentLimit: createCardDto.limit,
      user,
    });
    return this.cardRepository.save(card);
  }

  async findAll(user: User): Promise<Card[]> {
    return this.cardRepository.find({ where: { user } });
  }

  async findOne(id: string, user: User): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id, user } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async update(
    id: string,
    updateCardDto: UpdateCardDto,
    user: User,
  ): Promise<Card> {
    const card = await this.findOne(id, user);
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async remove(id: string, user: User): Promise<void> {
    const card = await this.findOne(id, user);
    await this.cardRepository.remove(card);
  }
}
