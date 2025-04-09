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
}
