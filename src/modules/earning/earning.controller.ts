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

@Controller('earnings')
export class EarningController {
  constructor(private readonly earningService: EarningService) {}

  @Post()
  create(
    @Body() createEarningDto: CreateEarningDto,
    @CurrentUser() user: User,
  ) {
    return this.earningService.create(createEarningDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.earningService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.earningService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEarningDto: UpdateEarningDto,
    @CurrentUser() user: User,
  ) {
    return this.earningService.update(id, updateEarningDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.earningService.remove(id, user);
  }
}
