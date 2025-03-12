import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Gender, User } from './entities/user.entity';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    description: 'User creation data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
        name: { type: 'string', example: 'John Doe' },
        dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
        gender: {
          type: 'string',
          enum: Object.values(Gender),
          example: Gender.MALE,
        },
      },
      required: ['email', 'password', 'name', 'dateOfBirth', 'gender'],
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'The details of the current authenticated user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
