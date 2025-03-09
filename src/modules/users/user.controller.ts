import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Gender, User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      dateOfBirth: Date;
      gender: Gender;
    },
  ): Promise<User> {
    return this.userService.createUser(
      body.email,
      body.password,
      body.name,
      body.dateOfBirth,
      body.gender,
    );
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
