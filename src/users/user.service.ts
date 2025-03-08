import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Gender, User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    birthday: Date,
    gender: Gender,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    user.dateOfBirth = birthday;
    user.gender = gender;

    return this.dataSource.manager.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.dataSource.manager.find(User);
  }
}
