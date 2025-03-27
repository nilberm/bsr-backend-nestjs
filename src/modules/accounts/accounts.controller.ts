import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'The account has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateAccountDto })
  create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.accountsService.create(createAccountDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of accounts belonging to the authenticated user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.accountsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific account' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Account does not belong to the user.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.accountsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Account does not belong to the user.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateAccountDto })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.accountsService.update(id, updateAccountDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Account does not belong to the user.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.accountsService.remove(id, user.id);
  }

  @Patch(':id/edit-balance')
  @ApiOperation({ summary: 'Update account balance by ID' })
  @ApiResponse({ status: 200, description: 'Balance updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Account does not belong to the user.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ schema: { properties: { balance: { type: 'number' } } } })
  updateBalance(
    @Param('id') id: string,
    @Body('balance') balance: number,
    @CurrentUser() user: User,
  ) {
    return this.accountsService.updateBalance(id, balance, user.id);
  }
}
