/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Gender, User } from './entities/user.entity';
import { Account } from '../accounts/entities/account.entity';

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

      const userWithoutPassword = await this.dataSource.transaction(
        async (manager) => {
          const createdUser = await manager.save(user);

          const account = new Account();
          account.name = 'Main Account';
          account.balance = 0;
          account.isDefault = true;
          account.user = createdUser;

          await manager.save(account);

          const { password: _, ...userWithoutPassword } = createdUser;
          return userWithoutPassword;
        },
      );

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
