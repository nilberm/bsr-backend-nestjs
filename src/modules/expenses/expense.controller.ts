import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PayExpensesDto } from './dto/pay-expenses.dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'The expense has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateExpenseDto })
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return this.expenseService.create(createExpenseDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of all expenses for the current user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@CurrentUser() user: User) {
    return this.expenseService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The expense details.',
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateExpenseDto })
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseService.remove(id, user);
  }

  @Patch('pay')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark multiple expenses as paid' })
  @ApiResponse({ status: 200, description: 'Expenses marked as paid' })
  @ApiResponse({ status: 400, description: 'Invalid or duplicate IDs' })
  @ApiBody({ type: PayExpensesDto })
  markAsPaid(@Body() body: PayExpensesDto, @CurrentUser() user: User) {
    return this.expenseService.markAsPaid(body.expenseIds, user);
  }
}
