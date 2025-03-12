import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EarningService } from './earning.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Earnings')
@ApiBearerAuth()
@Controller('earnings')
export class EarningController {
  constructor(private readonly earningService: EarningService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new earning' })
  @ApiResponse({
    status: 201,
    description: 'The earning has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateEarningDto })
  create(
    @Body() createEarningDto: CreateEarningDto,
    @CurrentUser() user: User,
  ) {
    return this.earningService.create(createEarningDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all earnings for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of all earnings for the current user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@CurrentUser() user: User) {
    return this.earningService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an earning by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The earning details.',
  })
  @ApiResponse({ status: 404, description: 'Earning not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.earningService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an earning by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The earning has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Earning not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateEarningDto })
  update(
    @Param('id') id: string,
    @Body() updateEarningDto: UpdateEarningDto,
    @CurrentUser() user: User,
  ) {
    return this.earningService.update(id, updateEarningDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an earning by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The earning has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Earning not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the earning',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.earningService.remove(id, user);
  }
}
