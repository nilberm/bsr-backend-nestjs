import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CardMonthlyExpensesQueryDto } from './dto/card-monthly-expenses-query.dto';

@ApiTags('Report')
@ApiBearerAuth()
@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('monthly')
  @ApiOperation({
    summary: 'Get monthly financial report for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly report including earnings and expenses.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month to filter (1 = January, 12 = December)',
    example: 4,
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year to filter',
    example: 2025,
  })
  getMonthlyReport(
    @Query() query: MonthlyReportQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.reportService.getMonthlyReport(user, query);
  }

  @Get('range')
  @ApiOperation({
    summary: 'Get available month range for reports based on user data',
  })
  @ApiResponse({
    status: 200,
    description: 'Start and end date (first and last month with data)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getReportRange(@CurrentUser() user: User) {
    return this.reportService.getReportRange(user);
  }

  @Get('card-expenses')
  @ApiOperation({
    summary: 'Get expenses for a specific card and month/year',
  })
  @ApiResponse({
    status: 200,
    description: 'List of expenses for the selected card and total amount.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'cardId', required: true, description: 'UUID of the card' })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month (1-12)',
    example: 4,
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year',
    example: 2025,
  })
  getCardMonthlyExpenses(
    @Query() query: CardMonthlyExpensesQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.reportService.getCardMonthlyExpenses(user, query);
  }
}
