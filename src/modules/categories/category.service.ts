import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryType } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: User,
  ): Promise<Category> {
    if (createCategoryDto.isDefault) {
      throw new BadRequestException('Cannot create a default category.');
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      user,
      isDefault: false,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(user: User, type?: CategoryType): Promise<Category[]> {
    const where: FindOptionsWhere<Category>[] = [];

    if (type) {
      where.push({ user: { id: user.id }, type }, { isDefault: true, type });
    } else {
      where.push({ user: { id: user.id } }, { isDefault: true });
    }

    return this.categoryRepository.find({ where });
  }

  async findOne(id: string, user: User): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: [
        { id, user },
        { id, isDefault: true },
      ],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.isDefault) {
      throw new BadRequestException('Default categories cannot be updated');
    }

    if (!category.user || category.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own categories');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string, user: User): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.isDefault) {
      throw new BadRequestException('Default categories cannot be deleted');
    }

    if (!category.user || category.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own categories');
    }

    await this.categoryRepository.remove(category);
  }
}
