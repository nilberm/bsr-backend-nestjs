import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Gender, User } from './entities/user.entity';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  createUser(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      dateOfBirth: Date;
      gender: Gender;
    },
  ): Promise<Omit<User, 'password'>> {
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

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
