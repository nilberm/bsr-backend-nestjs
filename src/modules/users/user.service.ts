/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Gender, User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    birthday: Date,
    gender: Gender,
  ): Promise<Omit<User, 'password'>> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User();
      user.email = email;
      user.password = hashedPassword;
      user.name = name;
      user.dateOfBirth = birthday;
      user.gender = gender;

      const createdUser = await this.dataSource.manager.save(user);

      const { password: _, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail is already in use');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.dataSource.manager.find(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.dataSource.manager.findOne(User, { where: { email } });
  }
}
